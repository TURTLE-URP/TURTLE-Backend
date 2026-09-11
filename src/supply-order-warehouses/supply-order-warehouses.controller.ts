import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from '@nestjs/common';
import { SupplyOrderWarehousesService } from './supply-order-warehouses.service';
import { CreateSupplyOrderWarehouseDto } from './dto/create-supply-order-warehouse.dto';
import { UpdateSupplyOrderWarehouseDto } from './dto/update-supply-order-warehouse.dto';

@Controller('api/supply-order-warehouses')
export class SupplyOrderWarehousesController {
  constructor(private readonly service: SupplyOrderWarehousesService) {}

  @Post()
  create(@Body() dto: CreateSupplyOrderWarehouseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('supplyOrderId') supplyOrderId?: string,
    @Query('storageRoomId') storageRoomId?: string,
  ) {
    return this.service.findAll({
      ...(supplyOrderId && { supply_order_id: Number(supplyOrderId) }),
      ...(storageRoomId && { storage_room_id: Number(storageRoomId) }),
    });
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.findAll({ supply_order_id: orderId });
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.service.findAll({ storage_room_id: warehouseId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplyOrderWarehouseDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
