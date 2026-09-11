import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { SeedModule } from './seed/seed.module';
import { TablesModule } from './tables/tables.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { SupplyOrdersModule } from './supply-orders/supply-orders.module';
import { ComandasModule } from './comandas/comandas.module';
import { PaymentsModule } from './payments/payments.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InventoryModule,
    PrismaModule,
    HealthModule,
    SeedModule,
    TablesModule,
    MenuItemsModule,
    OrdersModule,
    AdminModule,
    SupplyOrdersModule,
    ComandasModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
