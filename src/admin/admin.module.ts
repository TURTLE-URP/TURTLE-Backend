import { Module } from '@nestjs/common';
import { AdminProductsModule } from './products/products.module';
import { AdminSuppliesModule } from './supplies/supplies.module';
import { AdminSuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [AdminProductsModule, AdminSuppliesModule, AdminSuppliersModule],
})
export class AdminModule {}
