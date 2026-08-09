import { Module } from '@nestjs/common';
import { SupplyOrdersService } from './supply-orders.service';
import { SupplyOrdersController } from './supply-orders.controller';

@Module({
  controllers: [SupplyOrdersController],
  providers: [SupplyOrdersService],
})
export class SupplyOrdersModule {}
