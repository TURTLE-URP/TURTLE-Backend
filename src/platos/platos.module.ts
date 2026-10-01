import { Module } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { PlatosController } from './platos.controller';

@Module({
  controllers: [PlatosController],
  providers: [PlatosService],
})
export class PlatosModule {}
