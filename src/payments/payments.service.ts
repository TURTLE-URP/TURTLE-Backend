import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { pago_medio_pago, Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  CreatePaymentDetailOnlyDto,
  UpdatePaymentDetailDto,
} from './dto/payment-detail.dto';

const include = {
  pedido: {
    include: {
      mesa: true,
    },
  },
  detalles: {
    include: { plato: true },
  },
} as const;

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { id: dto.pedidoId, deleted_at: null },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido #${dto.pedidoId} no encontrado`);
    }

    const menuItemIds = [...new Set(dto.details.map((d) => d.menuItemId))];
    const menuItems = await this.prisma.platos_Menu.findMany({
      where: { id: { in: menuItemIds }, deleted_at: null },
    });
    if (menuItems.length !== menuItemIds.length) {
      throw new NotFoundException(
        'Uno o más ítems de menú no fueron encontrados',
      );
    }

    return this.prisma.pago_Cliente.create({
      data: {
        codigo: `PAG-${Date.now().toString(36).toUpperCase()}`,
        id_pedido: dto.pedidoId,
        medio_pago: dto.medioPago,
        monto: dto.monto,
        url_comprobante: dto.urlComprobante,
        detalles: {
          create: dto.details.map((detail) => ({
            id_menu_item: detail.menuItemId,
            cantidad: detail.quantity,
            subtotal: detail.subtotal,
            IGV: detail.igv,
          })),
        },
      },
      include,
    });
  }

  async findAll(medioPago?: pago_medio_pago) {
    const where: Prisma.Pago_ClienteWhereInput = {};
    if (medioPago) where.medio_pago = medioPago;
    return this.prisma.pago_Cliente.findMany({
      where,
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.pago_Cliente.findUnique({
      where: { id },
      include,
    });
    if (!payment) {
      throw new NotFoundException(`Pago #${id} no encontrado`);
    }
    return payment;
  }

  async findByPedido(pedidoId: number) {
    return this.prisma.pago_Cliente.findMany({
      where: { id_pedido: pedidoId },
      include,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);
    return this.prisma.pago_Cliente.update({
      where: { id },
      data: {
        ...(dto.medioPago !== undefined ? { medio_pago: dto.medioPago } : {}),
        ...(dto.monto !== undefined ? { monto: dto.monto } : {}),
        ...(dto.urlComprobante !== undefined
          ? { url_comprobante: dto.urlComprobante }
          : {}),
      },
      include,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      await tx.detalles_Pago_Cliente.deleteMany({
        where: { id_pago: id },
      });
      return tx.pago_Cliente.delete({ where: { id } });
    });
  }

  async addDetail(paymentId: number, dto: CreatePaymentDetailOnlyDto) {
    await this.findOne(paymentId);
    const plato = await this.prisma.platos_Menu.findFirst({
      where: { id: dto.menuItemId, deleted_at: null },
    });
    if (!plato) {
      throw new NotFoundException(`Plato #${dto.menuItemId} no encontrado`);
    }
    return this.prisma.detalles_Pago_Cliente.create({
      data: {
        id_pago: paymentId,
        id_menu_item: dto.menuItemId,
        cantidad: dto.quantity,
        subtotal: dto.subtotal,
        IGV: dto.igv,
      },
      include: { plato: true },
    });
  }

  async updateDetail(detailId: number, dto: UpdatePaymentDetailDto) {
    const detail = await this.prisma.detalles_Pago_Cliente.findUnique({
      where: { id: detailId },
    });
    if (!detail) {
      throw new NotFoundException(`Detalle de pago #${detailId} no encontrado`);
    }
    return this.prisma.detalles_Pago_Cliente.update({
      where: { id: detailId },
      data: {
        ...(dto.quantity !== undefined ? { cantidad: dto.quantity } : {}),
        ...(dto.subtotal !== undefined ? { subtotal: dto.subtotal } : {}),
        ...(dto.igv !== undefined ? { IGV: dto.igv } : {}),
      },
      include: { plato: true },
    });
  }

  async removeDetail(detailId: number) {
    const detail = await this.prisma.detalles_Pago_Cliente.findUnique({
      where: { id: detailId },
    });
    if (!detail) {
      throw new NotFoundException(`Detalle de pago #${detailId} no encontrado`);
    }
    return this.prisma.detalles_Pago_Cliente.delete({
      where: { id: detailId },
    });
  }
}
