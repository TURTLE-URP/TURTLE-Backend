import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SupplyOrdersService } from './supply-orders.service';
import {
  CreateSupplyOrderDto,
  CalculateByDishesDto,
} from './dto/create-supply-order.dto';

@Controller('supply-orders')
export class SupplyOrdersController {
  constructor(private readonly supplyOrdersService: SupplyOrdersService) {}

  /*
  @Get('metrics')
  getMetrics() {
    return this.supplyOrdersService.getMetrics();
  }

  @Get('dishes')
  getDishes() {
    return this.supplyOrdersService.getDishes();
  }

  @Get('free-supplies')
  getFreeSupplyItems() {
    return this.supplyOrdersService.getFreeSupplyItems();
  }

  @Get('calculate-by-shortage')
  calculateByShortage() {
    return this.supplyOrdersService.calculateByShortage();
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('search') search?: string) {
    return this.supplyOrdersService.findAll(status, search);
  }

  @Post('calculate-by-dishes')
  calculateByDishes(@Body() dto: CalculateByDishesDto) {
    return this.supplyOrdersService.calculateByDishes(dto.items);
  }

  @Post()
  createOrders(@Body() dto: CreateSupplyOrderDto) {
    return this.supplyOrdersService.createOrders(dto);
  }
  */
}
