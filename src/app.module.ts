import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { SupplyOrderWarehousesModule } from './supply-order-warehouses/supply-order-warehouses.module';
import { IntegrationsModule } from './integrations/integrations.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    CustomersModule,
    UsersModule,
    AuditModule,
    SupplyOrderWarehousesModule,
    IntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
