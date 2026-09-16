import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RucController } from './ruc.controller';
import { RucService } from './ruc.service';

@Module({
  imports: [HttpModule],
  controllers: [RucController],
  providers: [RucService],
  exports: [RucService],
})
export class RucModule {}
