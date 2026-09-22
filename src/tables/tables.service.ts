import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { UpdateTableOcupadoDto } from './dto/update-table-ocupado.dto';

@Injectable()
export class TablesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async findByNumber(tableNumber: number) {
    const table = await this.prisma.mesa.findFirst({
      where: { numero_mesa: tableNumber, deleted_at: null },
    });
    if (!table) {
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    }
    return table;
  }

  async findAll() {
    return this.prisma.mesa.findMany({
      where: { deleted_at: null },
      orderBy: { numero_mesa: 'asc' },
    });
  }

  async updateOcupado(
    tableNumber: number,
    dto: UpdateTableOcupadoDto,
    updatedBy: number,
  ) {
    const table = await this.findByNumber(tableNumber);
    return this.prisma.mesa.update({
      where: { id: table.id },
      data: {
        ocupado: dto.ocupado,
        updated_at: new Date(),
        updated_by: updatedBy,
      },
    });
  }
}
