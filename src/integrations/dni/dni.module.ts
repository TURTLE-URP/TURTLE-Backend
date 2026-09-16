import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DniController } from './dni.controller';
import { DniService } from './dni.service';

@Module({
  imports: [HttpModule],
  controllers: [DniController],
  providers: [DniService],
  exports: [DniService],
})
export class DniModule {}
