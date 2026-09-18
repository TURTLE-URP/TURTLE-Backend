import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
// import {
//   customer_order_status_type,
//   customer_order_item_status_type,
// } from '@src/generated/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

const TAX_RATE = 0.18;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
  async create(dto: CreateOrderDto) {
    const table = await this.prisma.restaurant_table.findUnique({
      where: { table_number: dto.tableNumber },
    });
    if (!table)
      throw new NotFoundException(`Mesa #${dto.tableNumber} no encontrada`);

    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menu_items.findMany({
      where: { menu_item_id: { in: menuItemIds } },
    });
    const priceMap = Object.fromEntries(
      menuItems.map((m) => [m.menu_item_id, Number(m.unit_price)]),
    );

    let subtotal = 0;
    const orderItemsData = dto.items.map((item) => {
      const price = priceMap[item.menuItemId] ?? 0;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      return {
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        customer_comments: item.comments,
        status: 'pending' as const,
      };
    });

    const tax = subtotal * TAX_RATE;

    return this.prisma.customer_order.create({
      data: {
        restaurant_table_id: table.restaurant_table_id,
        customer_name: dto.customerName,
        customer_id: dto.customerId,
        order_type: dto.orderType,
        subtotal,
        tax,
        status: 'pending',
        payment_status: 'pending',
        customer_order_items: {
          create: orderItemsData,
        },
      },
      include: {
        restaurant_table: true,
        customer_order_items: {
          include: { menu_items: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.customer_order.findUnique({
      where: { customer_order_id: id },
      include: {
        restaurant_table: true,
        customer_order_items: {
          include: { menu_items: true },
        },
      },
    });
    if (!order) throw new NotFoundException(`Orden #${id} no encontrada`);
    return order;
  }

  async findByTable(tableNumber: number) {
    const table = await this.prisma.restaurant_table.findUnique({
      where: { table_number: tableNumber },
    });
    if (!table)
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    return this.prisma.customer_order.findMany({
      where: { restaurant_table_id: table.restaurant_table_id },
      include: {
        customer_order_items: {
          include: { menu_items: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: number, status: customer_order_status_type) {
    const order = await this.findOne(id);
    return this.prisma.customer_order.update({
      where: { customer_order_id: id },
      data: { status },
      include: {
        restaurant_table: true,
        customer_order_items: {
          include: { menu_items: true },
        },
      },
    });
  }

  async updateItemStatus(
    orderId: number,
    itemId: number,
    status: customer_order_item_status_type,
  ) {
    const item = await this.prisma.customer_order_items.findFirst({
      where: { customer_order_item_id: itemId, customer_order_id: orderId },
    });
    if (!item)
      throw new NotFoundException(`Item #${itemId} no encontrado en la orden`);
    return this.prisma.customer_order_items.update({
      where: { customer_order_item_id: itemId },
      data: { status },
    });
  }

  async findAll(status?: customer_order_status_type) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.customer_order.findMany({
      where,
      include: {
        restaurant_table: true,
        customer_order_items: {
          include: { menu_items: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
  */
}
