import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '@src/users/users.service';
import { Cliente_Digital } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateCustomerDto) {
    return this.usersService.createUsuarioClienteDigital(dto);
  }

  // async findAll(provider?: auth_provider_type) {
  //   const where: Prisma.digital_customerWhereInput = {};
  //   if (provider) where.auth_provider = provider;
  //   return this.prisma.digital_customer.findMany({
  //     where,
  //     orderBy: { digital_customer_id: 'desc' },
  //   });
  // }

  async findOne(id: number) {
    const customer = await this.prisma.cliente_Digital.findUnique({
      where: {
        id,
      },
    });
    if (!customer) throw new NotFoundException(`Cliente no encontrado`);
    return customer;
  }

  async remove(id: number) {
    return this.usersService.remove(id);
  }
}
