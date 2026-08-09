import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByNumber(tableNumber: number) {
    const table = await this.prisma.restaurant_table.findUnique({
      where: { table_number: tableNumber },
    });
    if (!table)
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    return table;
  }

  async findAll() {
    return this.prisma.restaurant_table.findMany({
      orderBy: { table_number: 'asc' },
    });
  }

  async updateStatus(tableNumber: number, status: 'available' | 'occupied') {
    const table = await this.findByNumber(tableNumber);
    return this.prisma.restaurant_table.update({
      where: { restaurant_table_id: table.restaurant_table_id },
      data: { status },
    });
  }
}
