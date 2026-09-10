import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { RucService } from './ruc.service';

@Controller('ruc')
export class RucController {
  constructor(@Inject(RucService) private readonly rucService: RucService) {}

  @Get(':numero')
  @HttpCode(200)
  lookup(@Param('numero') numero: string) {
    return this.rucService.lookup(numero);
  }
}
