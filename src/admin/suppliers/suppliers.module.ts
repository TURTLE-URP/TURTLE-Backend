import { Module } from '@nestjs/common';
import { AdminSuppliersController } from './suppliers.controller';
import { AdminSuppliersService } from './suppliers.service';

@Module({
  controllers: [AdminSuppliersController],
  providers: [AdminSuppliersService],
  exports: [AdminSuppliersService],
})
export class AdminSuppliersModule {}
