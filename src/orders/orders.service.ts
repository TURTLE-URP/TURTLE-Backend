import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { pedido_tipo } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

const TAX_RATE = 0.18;

const include = {
  mesa: true,
  cliente: true,
  detalles: {
    include: { plato: true },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateOrderDto, createdBy: number) {
    if (dto.tipo === pedido_tipo.local && dto.tableNumber == null) {
      throw new BadRequestException(
        'tableNumber es requerido cuando tipo es local',
      );
    }

    let idMesa: number | undefined;
    if (dto.tableNumber != null) {
      const mesa = await this.prisma.mesa.findFirst({
        where: { numero_mesa: dto.tableNumber, deleted_at: null },
      });
      if (!mesa) {
        throw new NotFoundException(`Mesa #${dto.tableNumber} no encontrada`);
      }
      idMesa = mesa.id;
    }

    if (dto.idClienteDigital != null) {
      const cliente = await this.prisma.cliente_Digital.findUnique({
        where: { id: dto.idClienteDigital },
      });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente digital #${dto.idClienteDigital} no encontrado`,
        );
      }
    }

    const menuItemIds = [...new Set(dto.items.map((i) => i.menuItemId))];
    const menuItems = await this.prisma.platos_Menu.findMany({
      where: { id: { in: menuItemIds }, deleted_at: null },
    });
    if (menuItems.length !== menuItemIds.length) {
      throw new NotFoundException(
        'Uno o más ítems de menú no fueron encontrados',
      );
    }

    const priceMap = new Map(
      menuItems.map((m) => [m.id, Number(m.precio)] as const),
    );

    let subtotal = 0;
    const detallesData = dto.items.map((item) => {
      const price = priceMap.get(item.menuItemId) ?? 0;
      const lineSubtotal = price * item.quantity;
      subtotal += lineSubtotal;
      return {
        id_menu_item: item.menuItemId,
        cantidad: item.quantity,
        subtotal: lineSubtotal,
      };
    });

    const igv = subtotal * TAX_RATE;

    return this.prisma.pedido.create({
      data: {
        codigo: `PED-${Date.now().toString(36).toUpperCase()}`,
        tipo: dto.tipo,
        IGV: igv,
        subtotal,
        id_mesa: idMesa,
        nombre_cliente_local: dto.nombreClienteLocal,
        documento_cliente_local: dto.documentoClienteLocal,
        id_cliente_digital: dto.idClienteDigital,
        created_by: createdBy,
        detalles: { create: detallesData },
      },
      include,
    });
  }

  async findAll(tipo?: pedido_tipo) {
    return this.prisma.pedido.findMany({
      where: {
        deleted_at: null,
        ...(tipo ? { tipo } : {}),
      },
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.pedido.findFirst({
      where: { id, deleted_at: null },
      include,
    });
    if (!order) {
      throw new NotFoundException(`Pedido #${id} no encontrado`);
    }
    return order;
  }

  async findByTable(tableNumber: number) {
    const mesa = await this.prisma.mesa.findFirst({
      where: { numero_mesa: tableNumber, deleted_at: null },
    });
    if (!mesa) {
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    }
    return this.prisma.pedido.findMany({
      where: { id_mesa: mesa.id, deleted_at: null },
      include,
      orderBy: { created_at: 'desc' },
    });
  }
}
