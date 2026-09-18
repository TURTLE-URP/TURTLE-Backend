import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';

const supplierOptionsInclude = {
  supplier_catalog_items: {
    include: { suppliers: true },
  },
} as const;

@Injectable()
export class SupplyOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
  async getMetrics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [ordersThisMonth, pendingOrders, totalSpentResult, supplies] =
      await Promise.all([
        this.prisma.supply_orders.count({
          where: { emission_date: { gte: firstDayOfMonth } },
        }),
        this.prisma.supply_orders.count({ where: { status: 'pendiente' } }),
        this.prisma.supply_orders.aggregate({
          _sum: { total_amount: true },
          where: { emission_date: { gte: firstDayOfMonth } },
        }),
        this.prisma.internal_supplies.findMany({
          select: { current_stock: true, min_stock: true },
        }),
      ]);

    const shortageCount = supplies.filter(
      (s) => Number(s.current_stock) <= Number(s.min_stock),
    ).length;

    return {
      ordersThisMonth,
      pendingOrders,
      totalSpentThisMonth: Number(totalSpentResult._sum.total_amount ?? 0),
      shortageCount,
    };
  }

  async findAll(status?: string, search?: string) {
    const where: any = {};
    if (status) where.status = status.toLowerCase();
    if (search) {
      where.OR = [
        { order_code: { contains: search, mode: 'insensitive' } },
        { group_code: { contains: search, mode: 'insensitive' } },
        {
          suppliers: {
            company_name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const orders = await this.prisma.supply_orders.findMany({
      where,
      include: { suppliers: true },
      orderBy: { emission_date: 'desc' },
    });

    return orders.map((order) => ({
      supplyOrderId: order.supply_order_id,
      orderCode: order.order_code,
      groupCode: order.group_code,
      supplierName: order.suppliers.company_name,
      emissionDate: order.emission_date,
      modality: order.modality,
      status: order.status,
      totalAmount: Number(order.total_amount),
    }));
  }

  async calculateByShortage() {
    const supplies = await this.prisma.internal_supplies.findMany({
      include: {
        units_of_measurement: true,
        ...supplierOptionsInclude,
      },
    });

    return supplies
      .filter((item) => Number(item.current_stock) <= Number(item.min_stock))
      .map((item) => ({
        internalSupplyId: item.internal_supply_id,
        name: item.name,
        code: item.code,
        currentStock: Number(item.current_stock),
        minStock: Number(item.min_stock),
        maxStock: Number(item.max_stock),
        unitSymbol: item.units_of_measurement?.symbol,
        neededQuantity: Number(item.max_stock) - Number(item.current_stock),
        supplierOptions: item.supplier_catalog_items.map((cat) => ({
          supplierCatalogItemId: cat.supplier_catalog_item_id,
          supplierId: cat.supplier_id,
          supplierName: cat.suppliers.company_name,
          productName: cat.name,
          unitPrice: Number(cat.unit_price),
          conversionFactor: Number(cat.conversion_factor),
        })),
      }));
  }

  async getDishes() {
    const dishes = await this.prisma.menu_items.findMany({
      where: { status: 'available' },
      include: { _count: { select: { menu_item_ingredients: true } } },
      orderBy: { name: 'asc' },
    });

    return dishes.map((dish) => ({
      dishId: dish.menu_item_id,
      name: dish.name,
      ingredientsCount: dish._count.menu_item_ingredients,
    }));
  }

  async calculateByDishes(demands: { dishId: number; quantity: number }[]) {
    if (!demands?.length) {
      throw new BadRequestException(
        'Debe enviar al menos un platillo con su cantidad',
      );
    }

    const quantityMap = new Map(demands.map((d) => [d.dishId, d.quantity]));

    const dishes = await this.prisma.menu_items.findMany({
      where: { menu_item_id: { in: demands.map((d) => d.dishId) } },
      include: {
        menu_item_ingredients: {
          include: {
            internal_supplies: {
              include: {
                units_of_measurement: true,
                ...supplierOptionsInclude,
              },
            },
          },
        },
      },
    });

    const insumos = new Map<number, any>();
    for (const dish of dishes) {
      const orderQty = quantityMap.get(dish.menu_item_id) ?? 0;
      if (orderQty <= 0) continue;

      for (const ing of dish.menu_item_ingredients) {
        const totalNeeded = Number(ing.equivalence_factor) * orderQty;
        const existing = insumos.get(ing.internal_supply_id);
        if (existing) {
          existing.neededQuantity += totalNeeded;
          continue;
        }
        insumos.set(ing.internal_supply_id, {
          internalSupplyId: ing.internal_supply_id,
          name: ing.internal_supplies.name,
          code: ing.internal_supplies.code,
          currentStock: Number(ing.internal_supplies.current_stock),
          neededQuantity: totalNeeded,
          unitSymbol: ing.internal_supplies.units_of_measurement?.symbol,
          supplierOptions: ing.internal_supplies.supplier_catalog_items.map(
            (cat) => ({
              supplierCatalogItemId: cat.supplier_catalog_item_id,
              supplierId: cat.supplier_id,
              supplierName: cat.suppliers.company_name,
              productName: cat.name,
              unitPrice: Number(cat.unit_price),
              conversionFactor: Number(cat.conversion_factor),
            }),
          ),
        });
      }
    }

    return Array.from(insumos.values());
  }

  async getFreeSupplyItems() {
    const supplies = await this.prisma.internal_supplies.findMany({
      include: {
        units_of_measurement: true,
        ...supplierOptionsInclude,
      },
      orderBy: { name: 'asc' },
    });

    return supplies.map((item) => ({
      internalSupplyId: item.internal_supply_id,
      name: item.name,
      code: item.code,
      currentStock: Number(item.current_stock),
      unitSymbol: item.units_of_measurement?.symbol,
      supplierOptions: item.supplier_catalog_items.map((cat) => ({
        supplierCatalogItemId: cat.supplier_catalog_item_id,
        supplierId: cat.supplier_id,
        supplierName: cat.suppliers.company_name,
        productName: cat.name,
        unitPrice: Number(cat.unit_price),
        conversionFactor: Number(cat.conversion_factor),
      })),
    }));
  }

  async createOrders(dto: CreateSupplyOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException(
        'Debe incluir al menos un ítem para emitir la orden',
      );
    }

    const catalogItemIds = dto.items.map((i) => i.supplierCatalogItemId);
    const catalogItems = await this.prisma.supplier_catalog_items.findMany({
      where: { supplier_catalog_item_id: { in: catalogItemIds } },
    });

    if (catalogItems.length !== catalogItemIds.length) {
      throw new BadRequestException(
        'Uno o más ítems del catálogo comercial no existen',
      );
    }

    const qtyMap = new Map(
      dto.items.map((i) => [i.supplierCatalogItemId, i.quantity]),
    );

    const groupedBySupplier = new Map<number, any[]>();
    for (const cat of catalogItems) {
      if (!groupedBySupplier.has(cat.supplier_id)) {
        groupedBySupplier.set(cat.supplier_id, []);
      }
      groupedBySupplier.get(cat.supplier_id)!.push({
        supplierCatalogItemId: cat.supplier_catalog_item_id,
        quantity: qtyMap.get(cat.supplier_catalog_item_id) ?? 0,
        unitPrice: Number(cat.unit_price),
      });
    }

    const groupCount = await this.prisma.supply_orders.count();
    const groupCode = `G-${String(groupCount + 1).padStart(3, '0')}`;

    const orders = await this.prisma.$transaction(async (tx) => {
      const created: any[] = [];
      let orderIndex = 1;
      for (const [supplierId, items] of groupedBySupplier.entries()) {
        const totalAmount = items.reduce(
          (sum, i) => sum + i.quantity * i.unitPrice,
          0,
        );
        const orderCode = `OA-${String(groupCount + orderIndex).padStart(4, '0')}`;
        orderIndex += 1;

        const order = await tx.supply_orders.create({
          data: {
            order_code: orderCode,
            group_code: groupCode,
            modality: dto.modality,
            status: 'pendiente',
            total_amount: totalAmount,
            supplier_id: supplierId,
            supply_order_contents: {
              create: items.map((i) => ({
                supplier_catalog_item_id: i.supplierCatalogItemId,
                quantity: i.quantity,
              })),
            },
          },
          include: {
            suppliers: true,
            supply_order_contents: {
              include: { supplier_catalog_items: true },
            },
          },
        });
        created.push(order);
      }
      return created;
    });

    return {
      success: true,
      message: `${orders.length} orden(es) emitida(s) exitosamente`,
      groupCode,
      ordersCreatedCount: orders.length,
      orders,
    };
  }
  */
}
