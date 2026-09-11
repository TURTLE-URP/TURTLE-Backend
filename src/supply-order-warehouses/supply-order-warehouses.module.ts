import { Module } from '@nestjs/common';
import { SupplyOrderWarehousesController } from './supply-order-warehouses.controller';
import { SupplyOrderWarehousesService } from './supply-order-warehouses.service';

@Module({
  controllers: [SupplyOrderWarehousesController],
  providers: [SupplyOrderWarehousesService],
  exports: [SupplyOrderWarehousesService],
})
export class SupplyOrderWarehousesModule {}
