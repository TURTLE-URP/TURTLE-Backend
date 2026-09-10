import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { DniService } from './dni.service';

@Controller('dni')
export class DniController {
  constructor(@Inject(DniService) private readonly dniService: DniService) {}

  @Get(':numero')
  @HttpCode(200)
  lookup(@Param('numero') numero: string) {
    return this.dniService.lookup(numero);
  }
}
