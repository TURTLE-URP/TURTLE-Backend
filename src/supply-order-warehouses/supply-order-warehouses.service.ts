import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@src/generated/prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplyOrderWarehouseDto } from './dto/create-supply-order-warehouse.dto';
import { UpdateSupplyOrderWarehouseDto } from './dto/update-supply-order-warehouse.dto';

@Injectable()
export class SupplyOrderWarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  private validateId(id: string) {
    const n = Number(id);
    if (Number.isNaN(n) || n <= 0)
      throw new BadRequestException('El id debe ser un entero positivo');
    return n;
  }

  async create(dto: CreateSupplyOrderWarehouseDto) {
    await this.prisma.supply_orders.findUniqueOrThrow({
      where: { supply_order_id: dto.supplyOrderId },
    });
    await this.prisma.storage_rooms.findUniqueOrThrow({
      where: { storage_room_id: dto.storageRoomId },
    });

    return this.prisma.supply_order_warehouses.create({
      data: {
        quantity: dto.quantity,
        supply_order_id: dto.supplyOrderId,
        storage_room_id: dto.storageRoomId,
      },
    });
  }

  findAll(where: Prisma.supply_order_warehousesWhereInput = {}) {
    return this.prisma.supply_order_warehouses.findMany({
      where,
      include: {
        supply_orders: true,
        storage_rooms: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.supply_order_warehouses.findUnique({
      where: { supply_order_warehouse_id: id },
      include: {
        supply_orders: true,
        storage_rooms: true,
      },
    });
  }

  async update(id: number, dto: UpdateSupplyOrderWarehouseDto) {
    await this.findOneOrThrow(id);

    if (dto.supplyOrderId) {
      await this.prisma.supply_orders.findUniqueOrThrow({
        where: { supply_order_id: dto.supplyOrderId },
      });
    }
    if (dto.storageRoomId) {
      await this.prisma.storage_rooms.findUniqueOrThrow({
        where: { storage_room_id: dto.storageRoomId },
      });
    }

    return this.prisma.supply_order_warehouses.update({
      where: { supply_order_warehouse_id: id },
      data: {
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.supplyOrderId !== undefined && {
          supply_order_id: dto.supplyOrderId,
        }),
        ...(dto.storageRoomId !== undefined && {
          storage_room_id: dto.storageRoomId,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);

    return this.prisma.supply_order_warehouses.delete({
      where: { supply_order_warehouse_id: id },
    });
  }

  private async findOneOrThrow(id: number) {
    const item = await this.findOne(id);
    if (!item)
      throw new NotFoundException(
        `supply_order_warehouse con id ${id} no encontrado`,
      );
    return item;
  }
}
