import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Prisma, payment_method_type } from '@src/generated/prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  CreatePaymentDetailOnlyDto,
  UpdatePaymentDetailDto,
} from './dto/payment-detail.dto';

const include = {
  customer_order: {
    include: {
      restaurant_table: true,
    },
  },
  payment_details: {
    include: { menu_items: true },
  },
} as const;

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.customer_order.findUnique({
      where: { customer_order_id: dto.customerOrderId },
    });
    if (!order)
      throw new NotFoundException(
        `Orden #${dto.customerOrderId} no encontrada`,
      );

    const menuItemIds = dto.details.map((d) => d.menuItemId);
    const menuItems = await this.prisma.menu_items.findMany({
      where: { menu_item_id: { in: menuItemIds } },
    });
    if (menuItems.length !== menuItemIds.length)
      throw new NotFoundException(
        'Uno o más ítems de menú no fueron encontrados',
      );

    return this.prisma.payment.create({
      data: {
        code: `P-${Date.now().toString(36).toUpperCase()}`,
        customer_order_id: dto.customerOrderId,
        payment_method: dto.paymentMethod,
        amount: dto.amount,
        receipt_url: dto.receiptUrl,
        payment_details: {
          create: dto.details.map((detail) => ({
            menu_item_id: detail.menuItemId,
            quantity: detail.quantity,
            subtotal: detail.subtotal,
            tax: detail.tax,
          })),
        },
      },
      include,
    });
  }

  async findAll(method?: payment_method_type) {
    const where: Prisma.paymentWhereInput = {};
    if (method) where.payment_method = method;
    return this.prisma.payment.findMany({
      where,
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: id },
      include,
    });
    if (!payment) throw new NotFoundException(`Pago #${id} no encontrado`);
    return payment;
  }

  async findByOrder(customerOrderId: number) {
    return this.prisma.payment.findMany({
      where: { customer_order_id: customerOrderId },
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(
    id: number,
    dto: {
      paymentMethod?: payment_method_type;
      amount?: number;
      receiptUrl?: string;
    },
  ) {
    await this.findOne(id);
    return this.prisma.payment.update({
      where: { payment_id: id },
      data: {
        payment_method: dto.paymentMethod,
        amount: dto.amount,
        receipt_url: dto.receiptUrl,
      },
      include,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.payment.delete({
      where: { payment_id: id },
    });
  }

  async addDetail(paymentId: number, dto: CreatePaymentDetailOnlyDto) {
    await this.findOne(paymentId);
    return this.prisma.payment_details.create({
      data: {
        payment_id: paymentId,
        menu_item_id: dto.menuItemId,
        quantity: dto.quantity,
        subtotal: dto.subtotal,
        tax: dto.tax,
      },
      include: { menu_items: true },
    });
  }

  async updateDetail(detailId: number, dto: UpdatePaymentDetailDto) {
    const detail = await this.prisma.payment_details.findUnique({
      where: { payment_detail_id: detailId },
    });
    if (!detail)
      throw new NotFoundException(`Detalle de pago #${detailId} no encontrado`);
    return this.prisma.payment_details.update({
      where: { payment_detail_id: detailId },
      data: {
        quantity: dto.quantity,
        subtotal: dto.subtotal,
        tax: dto.tax,
      },
    });
  }

  async removeDetail(detailId: number) {
    const detail = await this.prisma.payment_details.findUnique({
      where: { payment_detail_id: detailId },
    });
    if (!detail)
      throw new NotFoundException(`Detalle de pago #${detailId} no encontrado`);
    return this.prisma.payment_details.delete({
      where: { payment_detail_id: detailId },
    });
  }
}
