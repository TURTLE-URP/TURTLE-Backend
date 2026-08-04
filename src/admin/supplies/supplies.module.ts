import { Module } from '@nestjs/common';
import { AdminSuppliesController } from './supplies.controller';
import { AdminSuppliesService } from './supplies.service';

@Module({
  controllers: [AdminSuppliesController],
  providers: [AdminSuppliesService],
  exports: [AdminSuppliesService],
})
export class AdminSuppliesModule {}
