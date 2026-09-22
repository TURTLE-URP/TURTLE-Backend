import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { platos_categoria } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

const detailInclude = {
  ingredientes: {
    include: {
      insumo: true,
      medida: true,
      almacen: true,
    },
  },
} as const;

@Injectable()
export class MenuItemsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async findAll(categoria?: platos_categoria) {
    return this.prisma.platos_Menu.findMany({
      where: {
        deleted_at: null,
        ...(categoria ? { categoria } : {}),
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.platos_Menu.findFirst({
      where: { id, deleted_at: null },
      include: detailInclude,
    });
    if (!item) {
      throw new NotFoundException(`Plato #${id} no encontrado`);
    }
    return item;
  }
}
