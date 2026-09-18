import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RucService } from './ruc.service';
import { RucLookup } from './entities/ruc.entity';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('ruc')
@Public()
@Controller('ruc')
export class RucController {
  constructor(@Inject(RucService) private readonly rucService: RucService) {}

  @Get(':numero')
  @HttpCode(200)
  @ApiOperation({ summary: 'Consulta RUC vía OpenRUC (sin API key)' })
  @ApiParam({
    name: 'numero',
    description: 'RUC de 11 dígitos numéricos',
    example: '20100047218',
  })
  @ApiOkResponse({ type: RucLookup })
  @ApiNotFoundResponse({ description: 'RUC was not found' })
  lookup(@Param('numero') numero: string) {
    return this.rucService.lookup(numero);
  }
}
