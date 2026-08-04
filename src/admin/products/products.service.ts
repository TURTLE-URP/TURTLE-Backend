import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tag?: string) {
    const where: any = {};
    if (tag) {
      where.menu_item_tagging = { some: { menu_item_tags: { name: tag } } };
    }
    return this.prisma.menu_items.findMany({
      where,
      include: {
        menu_item_tagging: { include: { menu_item_tags: true } },
        combo_description_combo_description_menu_item_idTomenu_items: {
          include: { menu_items_combo_description_combo_item_idTomenu_items: true },
        },
      },
      orderBy: { menu_item_id: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.menu_items.findUnique({
      where: { menu_item_id: id },
      include: {
        menu_item_tagging: { include: { menu_item_tags: true } },
        combo_description_combo_description_menu_item_idTomenu_items: {
          include: { menu_items_combo_description_combo_item_idTomenu_items: true },
        },
      },
    });
    if (!item) throw new NotFoundException(`Producto #${id} no encontrado`);
    return item;
  }

  async create(dto: CreateProductDto) {
    const { tags, ...data } = dto;
    return this.prisma.menu_items.create({
      data: {
        name: data.name,
        description: data.description,
        unit_price: data.unitPrice,
        status: data.status ?? 'available',
        type: data.type ?? 'item',
        ...(tags?.length
          ? {
              menu_item_tagging: {
                create: (await this.resolveTags(tags)).map((t) => ({ menu_item_tag_id: t.menu_item_tag_id })),
              },
            }
          : {}),
      },
      include: { menu_item_tagging: { include: { menu_item_tags: true } } },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    const { tags, ...data } = dto;
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.unitPrice !== undefined) updateData.unit_price = data.unitPrice;
    if (data.status !== undefined) updateData.status = data.status;

    if (tags !== undefined) {
      await this.prisma.menu_item_tagging.deleteMany({ where: { menu_item_id: id } });
      if (tags.length) {
        const tagRecords = (await this.resolveTags(tags)).map((t) => ({
          menu_item_id: id,
          menu_item_tag_id: t.menu_item_tag_id,
        }));
        await this.prisma.menu_item_tagging.createMany({ data: tagRecords });
      }
    }

    if (Object.keys(updateData).length) {
      await this.prisma.menu_items.update({ where: { menu_item_id: id }, data: updateData });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.menu_items.delete({ where: { menu_item_id: id } });
    return { deleted: true };
  }

  private async resolveTags(tags: string[]) {
    const existing = await this.prisma.menu_item_tags.findMany({
      where: { name: { in: tags } },
    });
    const existingMap = new Map(existing.map((t) => [t.name, t.menu_item_tag_id]));
    const tagIds = await Promise.all(
      tags.map(async (name) => {
        if (existingMap.has(name)) return existingMap.get(name)!;
        const created = await this.prisma.menu_item_tags.create({ data: { name, description: name } });
        return created.menu_item_tag_id;
      }),
    );
    return tagIds.map((menu_item_tag_id) => ({ menu_item_tag_id }));
  }
}
