import { Module } from '@nestjs/common';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
import { SuppliesExtrasController } from './supplies-extras.controller';
import { SuppliesExtrasService } from './supplies-extras.service';

@Module({
  controllers: [SuppliesController, SuppliesExtrasController],
  providers: [SuppliesService, SuppliesExtrasService],
})
export class SuppliesModule {}