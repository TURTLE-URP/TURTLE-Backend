import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Prisma, auth_provider_type } from '@src/generated/prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const where: Prisma.digital_customerWhereInput = {
      auth_provider: dto.authProvider,
      provider_user_id: dto.providerUserId,
    };
    const existing = await this.prisma.digital_customer.findFirst({ where });
    if (existing) return existing;

    return this.prisma.digital_customer.create({
      data: {
        full_name: dto.fullName,
        auth_provider: dto.authProvider,
        provider_user_id: dto.providerUserId,
      },
      include: { _count: { select: { customer_order: true } } },
    });
  }

  async findAll(provider?: auth_provider_type) {
    const where: Prisma.digital_customerWhereInput = {};
    if (provider) where.auth_provider = provider;
    return this.prisma.digital_customer.findMany({
      where,
      orderBy: { digital_customer_id: 'desc' },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.digital_customer.findUnique({
      where: { digital_customer_id: id },
      include: {
        customer_order: true,
      },
    });
    if (!customer) throw new NotFoundException(`Cliente #${id} no encontrado`);
    return customer;
  }

  async findByProvider(provider: auth_provider_type, providerUserId: string) {
    return this.prisma.digital_customer.findFirst({
      where: { auth_provider: provider, provider_user_id: providerUserId },
      include: { customer_order: true },
    });
  }

  async update(id: number, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.digital_customer.update({
      where: { digital_customer_id: id },
      data: {
        full_name: dto.fullName,
        auth_provider: dto.authProvider,
        provider_user_id: dto.providerUserId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.digital_customer.delete({
      where: { digital_customer_id: id },
    });
  }
}
