import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { CreateComandaItemOnlyDto } from './dto/create-comanda-item.dto';
import { CreateKitchenMovementDto } from './dto/create-kitchen-movement.dto';

const include = {
  customer_order: {
    include: {
      restaurant_table: true,
      customer_order_items: { include: { menu_items: true } },
    },
  },
  comanda_items: {
    include: {
      menu_items: true,
      kitchen_movements: true,
    },
  },
} as const;

@Injectable()
export class ComandasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComandaDto) {
    const order = await this.prisma.customer_order.findUnique({
      where: { customer_order_id: dto.customerOrderId },
    });
    if (!order)
      throw new NotFoundException(
        `Orden #${dto.customerOrderId} no encontrada`,
      );

    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menu_items.findMany({
      where: { menu_item_id: { in: menuItemIds } },
    });
    if (menuItems.length !== menuItemIds.length)
      throw new NotFoundException(
        'Uno o más ítems de menú no fueron encontrados',
      );

    return this.prisma.comanda.create({
      data: {
        code: `COM-${Date.now().toString(36).toUpperCase()}`,
        customer_order_id: dto.customerOrderId,
        comanda_items: {
          create: dto.items.map((item) => ({
            menu_item_id: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include,
    });
  }

  async findAll() {
    return this.prisma.comanda.findMany({
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const comanda = await this.prisma.comanda.findUnique({
      where: { comanda_id: id },
      include,
    });
    if (!comanda) throw new NotFoundException(`Comanda #${id} no encontrada`);
    return comanda;
  }

  async findByOrder(customerOrderId: number) {
    return this.prisma.comanda.findMany({
      where: { customer_order_id: customerOrderId },
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: number, data: { ready?: boolean }) {
    await this.findOne(id);
    return this.prisma.comanda.update({
      where: { comanda_id: id },
      data,
      include,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.comanda.delete({
      where: { comanda_id: id },
    });
  }

  async addItem(comandaId: number, dto: CreateComandaItemOnlyDto) {
    await this.findOne(comandaId);
    return this.prisma.comanda_items.create({
      data: {
        comanda_id: comandaId,
        menu_item_id: dto.menuItemId,
        quantity: dto.quantity,
        notes: dto.notes,
      },
      include: { menu_items: true, kitchen_movements: true },
    });
  }

  async updateItem(
    itemId: number,
    data: { quantity?: number; notes?: string },
  ) {
    const item = await this.prisma.comanda_items.findUnique({
      where: { comanda_item_id: itemId },
    });
    if (!item) throw new NotFoundException(`Item #${itemId} no encontrado`);
    return this.prisma.comanda_items.update({
      where: { comanda_item_id: itemId },
      data,
      include: { menu_items: true, kitchen_movements: true },
    });
  }

  async removeItem(itemId: number) {
    const item = await this.prisma.comanda_items.findUnique({
      where: { comanda_item_id: itemId },
    });
    if (!item) throw new NotFoundException(`Item #${itemId} no encontrado`);
    return this.prisma.comanda_items.delete({
      where: { comanda_item_id: itemId },
    });
  }

  async addMovement(comandaItemId: number, dto: CreateKitchenMovementDto) {
    const item = await this.prisma.comanda_items.findUnique({
      where: { comanda_item_id: comandaItemId },
    });
    if (!item)
      throw new NotFoundException(
        `Item de comanda #${comandaItemId} no encontrado`,
      );

    return this.prisma.kitchen_movements.create({
      data: {
        comanda_item_id: comandaItemId,
        status: dto.status,
        quantity: dto.quantity,
      },
    });
  }

  async getMovements(comandaItemId: number) {
    const item = await this.prisma.comanda_items.findUnique({
      where: { comanda_item_id: comandaItemId },
    });
    if (!item)
      throw new NotFoundException(
        `Item de comanda #${comandaItemId} no encontrado`,
      );

    return this.prisma.kitchen_movements.findMany({
      where: { comanda_item_id: comandaItemId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
