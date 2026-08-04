import { Controller, Get, Post, HttpCode, Body, Query } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { ListWarehousesDto } from './dto/list-warehouses.dto';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Get()
  @HttpCode(200)
  findAll(
    @Query('name') name: ListWarehousesDto['name'],
    @Query('page') page: ListWarehousesDto['page'],
  ) {
    return this.warehouseService.findAll({ name, page });
  }

  @Post()
  @HttpCode(201)
  createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    return 'lol';
  }
}
