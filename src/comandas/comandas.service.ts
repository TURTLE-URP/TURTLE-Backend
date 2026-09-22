import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { CreateComandaItemOnlyDto } from './dto/create-comanda-item.dto';
import { CreateKitchenMovementDto } from './dto/create-kitchen-movement.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';
import { UpdateComandaItemDto } from './dto/update-comanda-item.dto';

const include = {
  pedido: {
    include: {
      mesa: true,
      detalles: { include: { plato: true } },
    },
  },
  detalles: {
    include: {
      plato: true,
      movimientos: true,
    },
  },
} as const;

const itemInclude = {
  plato: true,
  movimientos: true,
} as const;

@Injectable()
export class ComandasService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateComandaDto) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { id: dto.pedidoId, deleted_at: null },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido #${dto.pedidoId} no encontrado`);
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

    return this.prisma.comanda.create({
      data: {
        codigo: `COM-${Date.now().toString(36).toUpperCase()}`,
        id_pedido: dto.pedidoId,
        detalles: {
          create: dto.items.map((item) => ({
            id_menu_item: item.menuItemId,
            cantidad: item.quantity,
            notas: item.notes,
          })),
        },
      },
      include,
    });
  }

  async findAll() {
    return this.prisma.comanda.findMany({
      include,
      orderBy: { fecha_hora_emision: 'desc' },
    });
  }

  async findOne(id: number) {
    const comanda = await this.prisma.comanda.findUnique({
      where: { id },
      include,
    });
    if (!comanda) {
      throw new NotFoundException(`Comanda #${id} no encontrada`);
    }
    return comanda;
  }

  async findByPedido(pedidoId: number) {
    return this.prisma.comanda.findMany({
      where: { id_pedido: pedidoId },
      include,
      orderBy: { fecha_hora_emision: 'desc' },
    });
  }

  async update(id: number, dto: UpdateComandaDto) {
    await this.findOne(id);
    const data: {
      listo?: boolean;
      fecha_hora_listo?: Date | null;
    } = {};
    if (dto.listo !== undefined) {
      data.listo = dto.listo;
      data.fecha_hora_listo = dto.listo ? new Date() : null;
    }
    return this.prisma.comanda.update({
      where: { id },
      data,
      include,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      const detalles = await tx.detalles_Comanda.findMany({
        where: { id_comanda: id },
        select: { id: true },
      });
      const detalleIds = detalles.map((d) => d.id);
      if (detalleIds.length > 0) {
        await tx.movimientos_Cocina.deleteMany({
          where: { id_detalle_comanda: { in: detalleIds } },
        });
        await tx.detalles_Comanda.deleteMany({
          where: { id_comanda: id },
        });
      }
      return tx.comanda.delete({ where: { id } });
    });
  }

  async addItem(comandaId: number, dto: CreateComandaItemOnlyDto) {
    await this.findOne(comandaId);
    const plato = await this.prisma.platos_Menu.findFirst({
      where: { id: dto.menuItemId, deleted_at: null },
    });
    if (!plato) {
      throw new NotFoundException(`Plato #${dto.menuItemId} no encontrado`);
    }
    return this.prisma.detalles_Comanda.create({
      data: {
        id_comanda: comandaId,
        id_menu_item: dto.menuItemId,
        cantidad: dto.quantity,
        notas: dto.notes,
      },
      include: itemInclude,
    });
  }

  async updateItem(itemId: number, dto: UpdateComandaItemDto) {
    const item = await this.prisma.detalles_Comanda.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException(`Item #${itemId} no encontrado`);
    }
    return this.prisma.detalles_Comanda.update({
      where: { id: itemId },
      data: {
        ...(dto.quantity !== undefined ? { cantidad: dto.quantity } : {}),
        ...(dto.notes !== undefined ? { notas: dto.notes } : {}),
      },
      include: itemInclude,
    });
  }

  async removeItem(itemId: number) {
    const item = await this.prisma.detalles_Comanda.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException(`Item #${itemId} no encontrado`);
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.movimientos_Cocina.deleteMany({
        where: { id_detalle_comanda: itemId },
      });
      return tx.detalles_Comanda.delete({ where: { id: itemId } });
    });
  }

  async addMovement(detalleComandaId: number, dto: CreateKitchenMovementDto) {
    const item = await this.prisma.detalles_Comanda.findUnique({
      where: { id: detalleComandaId },
    });
    if (!item) {
      throw new NotFoundException(
        `Item de comanda #${detalleComandaId} no encontrado`,
      );
    }

    return this.prisma.movimientos_Cocina.create({
      data: {
        id_detalle_comanda: detalleComandaId,
        estado_platillo: dto.estado,
        cantidad: dto.quantity,
      },
    });
  }

  async getMovements(detalleComandaId: number) {
    const item = await this.prisma.detalles_Comanda.findUnique({
      where: { id: detalleComandaId },
    });
    if (!item) {
      throw new NotFoundException(
        `Item de comanda #${detalleComandaId} no encontrado`,
      );
    }

    return this.prisma.movimientos_Cocina.findMany({
      where: { id_detalle_comanda: detalleComandaId },
      orderBy: { fecha_hora: 'desc' },
    });
  }
}
