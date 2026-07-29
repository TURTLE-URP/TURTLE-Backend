import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class SupplyOrdersService {
  private prisma: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  /**
   * 1. MÉTRICAS PARA LAS TARJETAS SUPERIORES (KPIs)
   */
  async getMetrics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let ordersThisMonth = 0;
    try {
      ordersThisMonth = await this.prisma.supply_orders.count({
        where: {
          emission_date: { gte: firstDayOfMonth },
        },
      });
    } catch (error) {
      console.error('Error al contar órdenes del mes:', error);
    }

    let pendingOrders = 0;
    try {
      pendingOrders = await this.prisma.supply_orders.count({
        where: { delivery_status: 'PENDING' },
      });
    } catch {
      try {
        pendingOrders = await this.prisma.supply_orders.count({
          where: { status: 'pendiente' },
        });
      } catch (error) {
        console.error('Error al contar órdenes pendientes:', error);
      }
    }

    let totalSpentThisMonth = 0;
    try {
      const totalSpentResult = await this.prisma.supply_orders.aggregate({
        _sum: { total_amount: true },
        where: {
          emission_date: { gte: firstDayOfMonth },
        },
      });
      totalSpentThisMonth = Number(totalSpentResult?._sum?.total_amount || 0);
    } catch (error) {
      console.error('Error al calcular total gastado:', error);
    }

    let shortageCount = 0;
    try {
      const supplies = await this.prisma.internal_supplies.findMany();
      shortageCount = supplies.filter(
        (item: any) => Number(item.current_stock) <= Number(item.min_stock),
      ).length;
    } catch (error) {
      console.error('Error al consultar escasez de insumos:', error);
    }

    return {
      ordersThisMonth,
      pendingOrders,
      totalSpentThisMonth,
      shortageCount,
    };
  }

  /**
   * 2. LISTA DE ÓRDENES PARA LA TABLA PRINCIPAL
   */
  async findAll(statusFilter?: string, search?: string) {
    const whereCondition: any = {};

    if (statusFilter && statusFilter !== 'Todas') {
      whereCondition.status = statusFilter.toLowerCase();
    }

    if (search) {
      whereCondition.OR = [
        { order_code: { contains: search, mode: 'insensitive' } },
        { group_code: { contains: search, mode: 'insensitive' } },
        { suppliers: { company_name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orders = await this.prisma.supply_orders.findMany({
      where: whereCondition,
      include: { suppliers: true },
      orderBy: { emission_date: 'desc' },
    });

    return orders.map((order: any) => ({
      supplyOrderId: order.supply_order_id,
      orderCode: order.order_code,
      groupCode: order.group_code,
      supplierName: order.suppliers?.company_name,
      emissionDate: order.emission_date,
      modality: order.modality,
      status: order.status,
      totalAmount: Number(order.total_amount),
    }));
  }

  /**
   * 3. MODALIDAD: CÁLCULO POR ESCASEZ
   */
  async calculateByShortage() {
    const supplies = await this.prisma.internal_supplies.findMany({
      include: {
        units_of_measurement: true,
        supplier_catalog_items: {
          include: { suppliers: true },
        },
      },
    });

    const shortageItems = supplies.filter(
      (item: any) => Number(item.current_stock) <= Number(item.min_stock),
    );

    return shortageItems.map((item: any) => {
      const current = Number(item.current_stock);
      const max = Number(item.max_stock);
      const neededQuantity = max - current;

      return {
        internalSupplyId: item.internal_supply_id,
        name: item.name,
        code: item.code,
        currentStock: current,
        minStock: Number(item.min_stock),
        maxStock: max,
        unitSymbol: item.units_of_measurement?.symbol,
        neededQuantity: neededQuantity,
        supplierOptions: item.supplier_catalog_items?.map((cat: any) => ({
          supplierCatalogItemId: cat.supplier_catalog_item_id,
          supplierId: cat.supplier_id,
          supplierName: cat.suppliers?.company_name,
          productName: cat.name,
          unitPrice: Number(cat.unit_price),
          conversionFactor: Number(cat.conversion_factor),
        })),
      };
    });
  }

  /**
   * 4. MODALIDAD POR PLATILLOS: Obtener catálogo de platillos
   */
  async getDishes() {
    try {
      const dishes = await this.prisma.dishes.findMany({
        include: {
          dish_recipes: true,
        },
      });

      return dishes.map((dish: any) => ({
        dishId: dish.dish_id,
        name: dish.name,
        ingredientsCount: dish.dish_recipes?.length || 0,
      }));
    } catch (error) {
      console.error('Error al obtener platillos:', error);
      return [];
    }
  }

  /**
   * 5. MODALIDAD POR PLATILLOS: Calcular insumos requeridos
   */
  async calculateByDishes(selectedDishes: { dishId: string; quantity: number }[]) {
    try {
      const dishIds = selectedDishes.map((item) => item.dishId);

      const dishesWithRecipes = await this.prisma.dishes.findMany({
        where: { dish_id: { in: dishIds } },
        include: {
          dish_recipes: {
            include: {
              internal_supplies: {
                include: {
                  units_of_measurement: true,
                  supplier_catalog_items: {
                    include: { suppliers: true },
                  },
                },
              },
            },
          },
        },
      });

      const requiredSuppliesMap = new Map<string, { supply: any; neededQuantity: number }>();

      for (const item of selectedDishes) {
        const dish = dishesWithRecipes.find((d: any) => d.dish_id === item.dishId);
        if (!dish || !dish.dish_recipes) continue;

        for (const recipeItem of dish.dish_recipes) {
          const supplyId = recipeItem.internal_supply_id;
          const qtyPerDish = Number(recipeItem.quantity || 0);
          const totalQtyNeeded = qtyPerDish * item.quantity;

          if (requiredSuppliesMap.has(supplyId)) {
            const current = requiredSuppliesMap.get(supplyId)!;
            current.neededQuantity += totalQtyNeeded;
          } else {
            requiredSuppliesMap.set(supplyId, {
              supply: recipeItem.internal_supplies,
              neededQuantity: totalQtyNeeded,
            });
          }
        }
      }

      return Array.from(requiredSuppliesMap.values()).map(({ supply, neededQuantity }) => ({
        internalSupplyId: supply.internal_supply_id,
        name: supply.name,
        code: supply.code,
        currentStock: Number(supply.current_stock),
        neededQuantity: Number(neededQuantity.toFixed(2)),
        unitSymbol: supply.units_of_measurement?.symbol,
        supplierOptions: supply.supplier_catalog_items?.map((cat: any) => ({
          supplierCatalogItemId: cat.supplier_catalog_item_id,
          supplierId: cat.supplier_id,
          supplierName: cat.suppliers?.company_name,
          productName: cat.name,
          unitPrice: Number(cat.unit_price),
          conversionFactor: Number(cat.conversion_factor),
        })),
      }));
    } catch (error) {
      console.error('Error al calcular insumos por platillo:', error);
      return [];
    }
  }

  /**
   * 6. MODALIDAD ABASTO LIBRE: Obtener lista completa de insumos
   */
  async getFreeSupplyItems() {
    try {
      const supplies = await this.prisma.internal_supplies.findMany({
        include: {
          units_of_measurement: true,
          supplier_catalog_items: {
            include: { suppliers: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      return supplies.map((item: any) => ({
        internalSupplyId: item.internal_supply_id,
        name: item.name,
        code: item.code,
        currentStock: Number(item.current_stock),
        unitSymbol: item.units_of_measurement?.symbol,
        supplierOptions: item.supplier_catalog_items?.map((cat: any) => ({
          supplierCatalogItemId: cat.supplier_catalog_item_id,
          supplierId: cat.supplier_id,
          supplierName: cat.suppliers?.company_name,
          productName: cat.name,
          unitPrice: Number(cat.unit_price),
          conversionFactor: Number(cat.conversion_factor),
        })),
      }));
    } catch (error) {
      console.error('Error al obtener insumos para abasto libre:', error);
      return [];
    }
  }

  /**
   * 7. EMITIR ÓRDENES: Guarda las órdenes agrupadas por proveedor en la BD
   */
  async createOrders(payload: {
    modality: string; // 'Por escasez', 'Por platillos', 'Abasto libre'
    items: {
      supplierId: string;
      supplierCatalogItemId?: string;
      internalSupplyId: string;
      quantity: number;
      unitPrice: number;
    }[];
  }) {
    try {
      if (!payload.items || payload.items.length === 0) {
        return { success: false, message: 'No hay insumos seleccionados para emitir.' };
      }

      // Generar código de grupo único (ej: G-001)
      const groupCount = await this.prisma.supply_orders.count();
      const groupCode = `G-${String(groupCount + 1).padStart(3, '0')}`;

      // Agrupar ítems por proveedor
      const itemsBySupplier = new Map<string, typeof payload.items>();

      for (const item of payload.items) {
        if (!itemsBySupplier.has(item.supplierId)) {
          itemsBySupplier.set(item.supplierId, []);
        }
        itemsBySupplier.get(item.supplierId)!.push(item);
      }

      const createdOrders: any[] = [];

      // Crear una orden por cada proveedor involucrado
      for (const [supplierId, items] of itemsBySupplier.entries()) {
        const totalAmount = items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0,
        );

        const orderCount = await this.prisma.supply_orders.count();
        const orderCode = `OA-${String(orderCount + 1).padStart(4, '0')}`;

        const newOrder = await this.prisma.supply_orders.create({
          data: {
            order_code: orderCode,
            group_code: groupCode,
            supplier_id: supplierId,
            modality: payload.modality || 'Abasto libre',
            status: 'acordada',
            total_amount: totalAmount,
            emission_date: new Date(),
          },
        });

        // Registrar los ítems/detalles de la orden
        for (const item of items) {
          await this.prisma.supply_order_items.create({
            data: {
              supply_order_id: newOrder.supply_order_id,
              internal_supply_id: item.internalSupplyId,
              supplier_catalog_item_id: item.supplierCatalogItemId || null,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              subtotal: item.quantity * item.unitPrice,
            },
          });
        }

        createdOrders.push(newOrder);
      }

      return {
        success: true,
        message: `${createdOrders.length} orden(es) emitida(s) exitosamente.`,
        groupCode,
        ordersCreatedCount: createdOrders.length,
      };
    } catch (error) {
      console.error('Error al emitir órdenes de abastecimiento:', error);
      return { success: false, message: 'Error interno al procesar las órdenes.' };
    }
  }
}