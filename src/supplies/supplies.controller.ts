import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { FindSuppliesQueryDto } from './dto/find-supplies-query.dto';
import { FindUnitsQueryDto } from './dto/find-units-query.dto';
import {
  SupplyResponseEntity,
  SupplyUnitResponseEntity,
} from './entities/supply-response.entity';
import { PaginatedSuppliesResponse } from './entities/paginated-supplies-response.entity';
import { SupplyDeletedEntity } from './entities/supply-deleted.entity';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('Insumos')
@ApiBearerAuth('bearer')
// TODO: agregar los guards/roles del proyecto (ver src/auth y src/common), p. ej.:
// @UseGuards(JwtAuthGuard, RolesGuard)
@Public()
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear insumo',
    description:
      'Registra un insumo con su unidad base. El código (INS-XXX) se genera en servidor y el stock global inicia en 0.',
  })
  @ApiCreatedResponse({
    type: SupplyResponseEntity,
    description: 'Insumo creado.',
  })
  @ApiBadRequestResponse({
    description: 'DTO inválido o la unidad base indicada no existe.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un insumo con ese código.',
  })
  create(@Body() dto: CreateSupplyDto) {
    return this.suppliesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar insumos (paginado)',
    description:
      'Lista insumos con paginación (`page`, `limit`) y búsqueda opcional (`search`) por nombre o código. `stockActual` es el stock a nivel global: SUM(Stock_Almacen.stock_actual).',
  })
  @ApiOkResponse({
    type: PaginatedSuppliesResponse,
    description: 'Página de insumos.',
  })
  findAll(@Query() query: FindSuppliesQueryDto) {
    return this.suppliesService.findAll(query);
  }

  @Get('units/base')
  @ApiOperation({
    summary: 'Listar unidades base',
    description:
      'Devuelve todas las unidades base registradas (Unidad_Medida). Solo `id`, `nombre` y `abreviatura`. Útil para los selects de creación/edición de insumos. Acepta `search` opcional por nombre o abreviatura.',
  })
  @ApiOkResponse({
    type: [SupplyUnitResponseEntity],
    description: 'Catálogo de unidades base.',
  })
  findUnidadesBase(@Query() query: FindUnitsQueryDto) {
    return this.suppliesService.findUnidadesBase(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalle de un insumo',
    description:
      'Obtiene un insumo por id con su unidad base y su stock a nivel global.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: SupplyResponseEntity,
    description: 'Insumo encontrado.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar insumo',
    description: 'Actualiza nombre, descripción y/o unidad base del insumo.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: SupplyResponseEntity,
    description: 'Insumo actualizado.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  @ApiBadRequestResponse({
    description: 'DTO inválido o la unidad base indicada no existe.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplyDto) {
    return this.suppliesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar insumo (borrado lógico)',
    description:
      'Marca el insumo como eliminado (deleted_at). No expone stocks por almacén.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: SupplyDeletedEntity,
    description: 'Insumo eliminado (baja lógica).',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.remove(id);
  }
}
