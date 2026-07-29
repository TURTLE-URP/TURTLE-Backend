import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SupplyOrdersService } from './supply-orders.service';

@Controller('supply-orders')
export class SupplyOrdersController {
  constructor(private readonly supplyOrdersService: SupplyOrdersService) {}

  @Get('metrics')
  async getMetrics() {
    return this.supplyOrdersService.getMetrics();
  }

  @Get('dishes')
  async getDishes() {
    return this.supplyOrdersService.getDishes();
  }

  @Get('free-supplies')
  async getFreeSupplyItems() {
    return this.supplyOrdersService.getFreeSupplyItems();
  }

  @Get('calculate-by-shortage')
  async calculateByShortage() {
    return this.supplyOrdersService.calculateByShortage();
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.supplyOrdersService.findAll(status, search);
  }

  @Post('calculate-by-dishes')
  async calculateByDishes(
    @Body() selectedDishes: { dishId: string; quantity: number }[],
  ) {
    return this.supplyOrdersService.calculateByDishes(selectedDishes);
  }

  @Post()
  async createOrders(@Body() payload: any) {
    return this.supplyOrdersService.createOrders(payload);
  }
}