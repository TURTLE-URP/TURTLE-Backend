import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DniService } from './dni.service';
import { DniLookup } from './entities/dni.entity';

@ApiTags('dni')
@Controller('dni')
export class DniController {
  constructor(@Inject(DniService) private readonly dniService: DniService) {}

  @Get(':numero')
  @HttpCode(200)
  @ApiOperation({ summary: 'Consulta DNI vía ApiInti (requiere API key)' })
  @ApiParam({
    name: 'numero',
    description: 'DNI de 8 dígitos numéricos',
    example: '12345678',
  })
  @ApiOkResponse({ type: DniLookup })
  @ApiNotFoundResponse({ description: 'DNI was not found' })
  @ApiUnauthorizedResponse({ description: 'APIINTI_API_KEY is not configured' })
  lookup(@Param('numero') numero: string) {
    return this.dniService.lookup(numero);
  }
}
