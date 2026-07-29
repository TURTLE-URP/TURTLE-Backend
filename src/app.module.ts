import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { SupplyOrdersModule } from './supply-orders/supply-orders.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InventoryModule,
    PrismaModule,
    HealthModule,
    SupplyOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
