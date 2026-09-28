import { Module } from '@nestjs/common';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
// Si PrismaService no se inyecta, importar aquí el PrismaModule:
// import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // imports: [PrismaModule],
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
