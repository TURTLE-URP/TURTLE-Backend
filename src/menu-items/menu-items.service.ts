import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

const itemInclude = {
  menu_item_tagging: {
    include: { menu_item_tags: true },
  },
  combo_description_combo_description_menu_item_idTomenu_items: {
    include: {
      menu_items_combo_description_combo_item_idTomenu_items: true,
    },
  },
};

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
  async findAll(tag?: string) {
    const where: any = { status: 'available' };
    if (tag) {
      where.menu_item_tagging = {
        some: { menu_item_tags: { name: tag } },
      };
    }
    return this.prisma.menu_items.findMany({
      where,
      include: itemInclude,
      orderBy: { menu_item_id: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.menu_items.findUnique({
      where: { menu_item_id: id },
      include: {
        ...itemInclude,
        menu_item_ingredients: {
          include: {
            internal_supplies: true,
            storage_rooms: true,
          },
        },
      },
    });
    if (!item) throw new NotFoundException(`Menu item #${id} no encontrado`);
    return item;
  }
  */
}
