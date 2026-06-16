import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplyDto, UpdateSupplyDto } from './dto/create-supply.dto';

const include = {
  units_of_measurement: true,
  internal_supplies_location: { include: { storage_rooms: true } },
  supply_tagging: { include: { internal_supply_tags: true } },
};

@Injectable()
export class AdminSuppliesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.internal_supplies.findMany({ include, orderBy: { internal_supply_id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.internal_supplies.findUnique({
      where: { internal_supply_id: id },
      include,
    });
    if (!item) throw new NotFoundException(`Insumo #${id} no encontrado`);
    return item;
  }

  async create(dto: CreateSupplyDto) {
    const { storageRoomIds, tags, ...data } = dto;
    return this.prisma.internal_supplies.create({
      data: {
        code: data.code,
        name: data.name,
        unit_of_measurement_id: data.unitOfMeasurementId,
        max_stock: data.maxStock,
        min_stock: data.minStock ?? 0,
        current_stock: data.currentStock ?? 0,
        image_url: data.imageUrl,
        ...(storageRoomIds?.length
          ? {
              internal_supplies_location: {
                create: storageRoomIds.map((storage_room_id) => ({
                  storage_room_id,
                  current_stock: data.currentStock ?? 0,
                })),
              },
            }
          : {}),
        ...(tags?.length
          ? {
              supply_tagging: {
                create: (await this.resolveSupplyTags(tags)).map((t) => ({ internal_supply_tag_id: t.internal_supply_tag_id })),
              },
            }
          : {}),
      },
      include,
    });
  }

  async update(id: number, dto: UpdateSupplyDto) {
    await this.findOne(id);
    const { storageRoomIds, tags, ...data } = dto;
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.unitOfMeasurementId !== undefined) updateData.unit_of_measurement_id = data.unitOfMeasurementId;
    if (data.maxStock !== undefined) updateData.max_stock = data.maxStock;
    if (data.minStock !== undefined) updateData.min_stock = data.minStock;
    if (data.currentStock !== undefined) updateData.current_stock = data.currentStock;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;

    if (storageRoomIds !== undefined) {
      await this.prisma.internal_supplies_location.deleteMany({ where: { internal_supply_id: id } });
      if (storageRoomIds.length) {
        await this.prisma.internal_supplies_location.createMany({
          data: storageRoomIds.map((storage_room_id) => ({
            internal_supply_id: id,
            storage_room_id,
            current_stock: data.currentStock ?? 0,
          })),
        });
      }
    }

    if (tags !== undefined) {
      await this.prisma.supply_tagging.deleteMany({ where: { internal_supply_id: id } });
      if (tags.length) {
        const tagRecords = (await this.resolveSupplyTags(tags)).map((t) => ({
          internal_supply_id: id,
          internal_supply_tag_id: t.internal_supply_tag_id,
        }));
        await this.prisma.supply_tagging.createMany({ data: tagRecords });
      }
    }

    if (Object.keys(updateData).length) {
      await this.prisma.internal_supplies.update({ where: { internal_supply_id: id }, data: updateData });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.internal_supplies.delete({ where: { internal_supply_id: id } });
    return { deleted: true };
  }

  private async resolveSupplyTags(tags: string[]) {
    const existing = await this.prisma.internal_supply_tags.findMany({
      where: { name: { in: tags } },
    });
    const existingMap = new Map(existing.map((t) => [t.name, t.internal_supply_tag_id]));
    const tagIds = await Promise.all(
      tags.map(async (name) => {
        if (existingMap.has(name)) return existingMap.get(name)!;
        const created = await this.prisma.internal_supply_tags.create({
          data: { name, description: name },
        });
        return created.internal_supply_tag_id;
      }),
    );
    return tagIds.map((internal_supply_tag_id) => ({
      internal_supply_tag_id,
    }));
  }
}
