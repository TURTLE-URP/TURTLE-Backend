import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableOcupadoDto } from './dto/update-table-ocupado.dto';

const pedidoAbiertoInclude = {
  where: { deleted_at: null, tipo: 'local' as const },
  orderBy: { created_at: 'desc' as const },
  take: 1,
  include: {
    detalles: {
      include: { plato: true },
    },
  },
} satisfies Prisma.Mesa$pedidosArgs;

const mesaWithPedido = {
  pedidos: pedidoAbiertoInclude,
} satisfies Prisma.MesaInclude;

@Injectable()
export class TablesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async findByNumber(tableNumber: number) {
    const table = await this.prisma.mesa.findFirst({
      where: { numero_mesa: tableNumber, deleted_at: null },
      include: mesaWithPedido,
    });
    if (!table) {
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    }
    return table;
  }

  async findAll() {
    return this.prisma.mesa.findMany({
      where: { deleted_at: null },
      include: mesaWithPedido,
      orderBy: { numero_mesa: 'asc' },
    });
  }

  async update(tableNumber: number, dto: UpdateTableDto, updatedBy?: number) {
    const table = await this.findByNumber(tableNumber);

    if (dto.numero != null && dto.numero !== table.numero_mesa) {
      const duplicate = await this.prisma.mesa.findFirst({
        where: {
          numero_mesa: dto.numero,
          deleted_at: null,
          id: { not: table.id },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `El Nro ${dto.numero} ya existe (${duplicate.codigo})`,
        );
      }
    }

    return this.prisma.mesa.update({
      where: { id: table.id },
      data: {
        ...(dto.numero != null ? { numero_mesa: dto.numero } : {}),
        ...(dto.capacidad != null ? { capacidad: dto.capacidad } : {}),
        ...(dto.piso != null ? { piso: dto.piso } : {}),
        ...(dto.ocupado != null ? { ocupado: dto.ocupado } : {}),
        updated_at: new Date(),
        ...(updatedBy != null ? { updated_by: updatedBy } : {}),
      },
      include: mesaWithPedido,
    });
  }

  async updateOcupado(
    tableNumber: number,
    dto: UpdateTableOcupadoDto,
    updatedBy?: number,
  ) {
    const table = await this.findByNumber(tableNumber);
    return this.prisma.mesa.update({
      where: { id: table.id },
      data: {
        ocupado: dto.ocupado,
        updated_at: new Date(),
        ...(updatedBy != null ? { updated_by: updatedBy } : {}),
      },
      include: mesaWithPedido,
    });
  }
}
