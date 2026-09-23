import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { orden_estado, Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';

type SupplierOption = {
  productoProveedorId: number;
  supplierId: number;
  supplierName: string;
  productName: string;
  unitPrice: number | null;
  conversionFactor: number;
};

@Injectable()
export class SupplyOrdersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  private mapSupplierOptions(
    productos: {
      id: number;
      nombre: string;
      precio_referencial: Prisma.Decimal | null;
      factor_conversion: Prisma.Decimal;
      id_proveedor: number;
      proveedor: { razon_social: string; deleted_at: Date | null };
    }[],
  ): SupplierOption[] {
    return productos
      .filter((p) => p.proveedor.deleted_at == null)
      .map((p) => ({
        productoProveedorId: p.id,
        supplierId: p.id_proveedor,
        supplierName: p.proveedor.razon_social,
        productName: p.nombre,
        unitPrice:
          p.precio_referencial != null ? Number(p.precio_referencial) : null,
        conversionFactor: Number(p.factor_conversion),
      }));
  }

  async getMetrics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [ordersThisMonth, openOrders, ordersWithDetails, stocks] =
      await Promise.all([
        this.prisma.orden_Abasto.count({
          where: { fecha_hora_emision: { gte: firstDayOfMonth } },
        }),
        this.prisma.orden_Abasto.count({
          where: { estado: orden_estado.emitida },
        }),
        this.prisma.orden_Abasto.findMany({
          where: { fecha_hora_emision: { gte: firstDayOfMonth } },
          include: {
            detalles: {
              include: { producto: true },
            },
          },
        }),
        this.prisma.stock_Almacen.findMany({
          select: {
            id_insumo: true,
            stock_actual: true,
            stock_min: true,
          },
        }),
      ]);

    const totalSpentThisMonth = ordersWithDetails.reduce((sum, order) => {
      const orderTotal = order.detalles.reduce((lineSum, d) => {
        const price = Number(d.producto.precio_referencial ?? 0);
        return lineSum + d.cantidad * price;
      }, 0);
      return sum + orderTotal;
    }, 0);

    const byInsumo = new Map<
      number,
      { actual: number; min: number }
    >();
    for (const s of stocks) {
      const prev = byInsumo.get(s.id_insumo) ?? { actual: 0, min: 0 };
      prev.actual += Number(s.stock_actual);
      prev.min += Number(s.stock_min);
      byInsumo.set(s.id_insumo, prev);
    }
    const shortageCount = [...byInsumo.values()].filter(
      (v) => v.actual <= v.min,
    ).length;

    return {
      ordersThisMonth,
      openOrders,
      totalSpentThisMonth,
      shortageCount,
    };
  }

  async findAll(estado?: orden_estado, search?: string) {
    const where: Prisma.Orden_AbastoWhereInput = {};
    if (estado) where.estado = estado;
    if (search) {
      where.OR = [
        { codigo: { contains: search, mode: 'insensitive' } },
        {
          proveedor: {
            razon_social: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const orders = await this.prisma.orden_Abasto.findMany({
      where,
      include: {
        proveedor: true,
        detalles: { include: { producto: true } },
      },
      orderBy: { fecha_hora_emision: 'desc' },
    });

    return orders.map((order) => {
      const totalAmount = order.detalles.reduce((sum, d) => {
        const price = Number(d.producto.precio_referencial ?? 0);
        return sum + d.cantidad * price;
      }, 0);
      return {
        id: order.id,
        codigo: order.codigo,
        estado: order.estado,
        supplierName: order.proveedor.razon_social,
        fechaHoraEmision: order.fecha_hora_emision,
        totalAmount,
      };
    });
  }

  async calculateByShortage() {
    const insumos = await this.prisma.insumo.findMany({
      where: { deleted_at: null },
      include: {
        unidad_base: true,
        stocks: true,
        productos: { include: { proveedor: true } },
      },
    });

    return insumos
      .map((item) => {
        const stockActual = item.stocks.reduce(
          (s, row) => s + Number(row.stock_actual),
          0,
        );
        const stockMin = item.stocks.reduce(
          (s, row) => s + Number(row.stock_min),
          0,
        );
        const stockIdeal = item.stocks.reduce(
          (s, row) => s + Number(row.stock_ideal),
          0,
        );
        return {
          insumoId: item.id,
          name: item.nombre,
          code: item.codigo,
          currentStock: stockActual,
          minStock: stockMin,
          idealStock: stockIdeal,
          unitSymbol: item.unidad_base.abreviatura,
          neededQuantity: Math.max(stockIdeal - stockActual, 0),
          supplierOptions: this.mapSupplierOptions(item.productos),
          _short: stockActual <= stockMin,
        };
      })
      .filter((item) => item._short)
      .map(({ _short, ...rest }) => {
        void _short;
        return rest;
      });
  }

  async getDishes() {
    const dishes = await this.prisma.platos_Menu.findMany({
      where: { deleted_at: null },
      include: { _count: { select: { ingredientes: true } } },
      orderBy: { nombre: 'asc' },
    });

    return dishes.map((dish) => ({
      dishId: dish.id,
      name: dish.nombre,
      ingredientsCount: dish._count.ingredientes,
    }));
  }

  async calculateByDishes(demands: { dishId: number; quantity: number }[]) {
    if (!demands?.length) {
      throw new BadRequestException(
        'Debe enviar al menos un platillo con su cantidad',
      );
    }

    const quantityMap = new Map(demands.map((d) => [d.dishId, d.quantity]));

    const dishes = await this.prisma.platos_Menu.findMany({
      where: {
        id: { in: demands.map((d) => d.dishId) },
        deleted_at: null,
      },
      include: {
        ingredientes: {
          include: {
            insumo: {
              include: {
                unidad_base: true,
                stocks: true,
                productos: { include: { proveedor: true } },
              },
            },
          },
        },
      },
    });

    const insumos = new Map<
      number,
      {
        insumoId: number;
        name: string;
        code: string;
        currentStock: number;
        neededQuantity: number;
        unitSymbol: string;
        supplierOptions: SupplierOption[];
      }
    >();

    for (const dish of dishes) {
      const orderQty = quantityMap.get(dish.id) ?? 0;
      if (orderQty <= 0) continue;

      for (const ing of dish.ingredientes) {
        const totalNeeded = Number(ing.cantidad) * orderQty;
        const existing = insumos.get(ing.id_insumo);
        if (existing) {
          existing.neededQuantity += totalNeeded;
          continue;
        }
        const stockActual = ing.insumo.stocks.reduce(
          (s, row) => s + Number(row.stock_actual),
          0,
        );
        insumos.set(ing.id_insumo, {
          insumoId: ing.id_insumo,
          name: ing.insumo.nombre,
          code: ing.insumo.codigo,
          currentStock: stockActual,
          neededQuantity: totalNeeded,
          unitSymbol: ing.insumo.unidad_base.abreviatura,
          supplierOptions: this.mapSupplierOptions(ing.insumo.productos),
        });
      }
    }

    return Array.from(insumos.values());
  }

  async getFreeSupplyItems() {
    const supplies = await this.prisma.insumo.findMany({
      where: { deleted_at: null },
      include: {
        unidad_base: true,
        stocks: true,
        productos: { include: { proveedor: true } },
      },
      orderBy: { nombre: 'asc' },
    });

    return supplies.map((item) => {
      const stockActual = item.stocks.reduce(
        (s, row) => s + Number(row.stock_actual),
        0,
      );
      return {
        insumoId: item.id,
        name: item.nombre,
        code: item.codigo,
        currentStock: stockActual,
        unitSymbol: item.unidad_base.abreviatura,
        supplierOptions: this.mapSupplierOptions(item.productos),
      };
    });
  }

  async createOrders(dto: CreateSupplyOrderDto, actorId: number) {
    if (!dto.items?.length) {
      throw new BadRequestException(
        'Debe incluir al menos un ítem para emitir la orden',
      );
    }

    const productoIds = [
      ...new Set(dto.items.map((i) => i.productoProveedorId)),
    ];
    const catalogItems = await this.prisma.productos_Proveedor.findMany({
      where: { id: { in: productoIds } },
      include: { proveedor: true },
    });

    if (catalogItems.length !== productoIds.length) {
      throw new BadRequestException(
        'Uno o más productos de proveedor no existen',
      );
    }

    const qtyMap = new Map(
      dto.items.map((i) => [i.productoProveedorId, i.quantity]),
    );

    const groupedBySupplier = new Map<
      number,
      { productoProveedorId: number; quantity: number; unitPrice: number }[]
    >();

    for (const cat of catalogItems) {
      if (cat.proveedor.deleted_at != null) {
        throw new BadRequestException(
          `Proveedor del producto #${cat.id} está dado de baja`,
        );
      }
      const list = groupedBySupplier.get(cat.id_proveedor) ?? [];
      list.push({
        productoProveedorId: cat.id,
        quantity: qtyMap.get(cat.id) ?? 0,
        unitPrice: Number(cat.precio_referencial ?? 0),
      });
      groupedBySupplier.set(cat.id_proveedor, list);
    }

    const existingCount = await this.prisma.orden_Abasto.count();

    const orders = await this.prisma.$transaction(async (tx) => {
      const created: Prisma.Orden_AbastoGetPayload<{
        include: {
          proveedor: true;
          detalles: { include: { producto: true } };
        };
      }>[] = [];
      let orderIndex = 1;
      for (const [supplierId, items] of groupedBySupplier.entries()) {
        const codigo = `OA-${String(existingCount + orderIndex).padStart(4, '0')}`;
        orderIndex += 1;

        const order = await tx.orden_Abasto.create({
          data: {
            codigo,
            estado: orden_estado.emitida,
            emitida_a: supplierId,
            emitida_por: actorId,
            created_by: actorId,
            detalles: {
              create: items.map((i) => ({
                id_producto_proveedor: i.productoProveedorId,
                cantidad: i.quantity,
              })),
            },
          },
          include: {
            proveedor: true,
            detalles: { include: { producto: true } },
          },
        });
        created.push(order);
      }
      return created;
    });

    return {
      success: true,
      message: `${orders.length} orden(es) emitida(s) exitosamente`,
      ordersCreatedCount: orders.length,
      orders,
    };
  }
}
