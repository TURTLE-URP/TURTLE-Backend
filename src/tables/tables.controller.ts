import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { TablesService } from './tables.service';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableOcupadoDto } from './dto/update-table-ocupado.dto';

@Controller('api/tables')
@ApiTags('tables')
@ApiBearerAuth()
export class TablesController {
  constructor(
    @Inject(TablesService) private readonly tablesService: TablesService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Lista mesas activas ordenadas por número, con el pedido local abierto más reciente.',
  })
  @ApiOkResponse({ description: 'Listado de mesas.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':tableNumber')
  @ApiOperation({ summary: 'Obtiene una mesa por número.' })
  @ApiOkResponse({ description: 'Mesa encontrada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findByNumber(@Param('tableNumber', ParseIntPipe) tableNumber: number) {
    return this.tablesService.findByNumber(tableNumber);
  }

  @Patch(':tableNumber')
  @ApiOperation({
    summary: 'Actualiza número, capacidad, piso y ocupación de la mesa.',
  })
  @ApiOkResponse({ description: 'Mesa actualizada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiConflictResponse({ description: 'El número de mesa ya existe.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  update(
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Body() dto: UpdateTableDto,
    @CurrentUserId() updatedBy: number,
  ) {
    return this.tablesService.update(tableNumber, dto, updatedBy);
  }

  @Patch(':tableNumber/ocupado')
  @ApiOperation({ summary: 'Actualiza el flag de ocupación de la mesa.' })
  @ApiOkResponse({ description: 'Mesa actualizada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  updateOcupado(
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Body() dto: UpdateTableOcupadoDto,
    @CurrentUserId() updatedBy: number,
  ) {
    return this.tablesService.updateOcupado(tableNumber, dto, updatedBy);
  }
}
