import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
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
import { SuppliesExtrasService } from './supplies-extras.service';
import {
  CreateMedidaDto,
  UpdateMedidaDto,
  UpsertAlertaAlmacenDto,
  UpsertAlertaGlobalDto,
} from './dto/supply-extras.dto';
import {
  MedidaDeletedEntity,
  MedidaResponseEntity,
} from './entities/medida-response.entity';
import {
  AlertaAlmacenResponseEntity,
  AlertaDeletedEntity,
  AlertaGlobalResponseEntity,
  SupplyAlertasResponseEntity,
} from './entities/alerta-response.entity';
import { EliminableResponseEntity } from './entities/eliminable-response.entity';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('Insumos - Detalle')
@ApiBearerAuth('bearer')
@Public()
// TODO: agregar los mismos guards/roles que usa SuppliesController
@Controller('supplies/:id')
export class SuppliesExtrasController {
  constructor(private readonly extrasService: SuppliesExtrasService) {}

  // ---------- Medidas alternas ----------

  @Get('medidas')
  @ApiOperation({
    summary: 'Listar medidas alternas del insumo',
    description:
      'Incluye la medida base (factorABase = 1, creada al registrar el insumo) y las alternas. `factorABase` es el factor de conversión a la unidad base.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: [MedidaResponseEntity],
    description: 'Lista de medidas del insumo.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  getMedidas(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getMedidas(id);
  }

  @Post('medidas')
  @ApiOperation({
    summary: 'Agregar una medida alterna al insumo',
    description:
      'Crea una medida con su factor de conversión. El `uso` indica dónde aplica: todo, receta o productos_proveedor.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiCreatedResponse({
    type: MedidaResponseEntity,
    description: 'Medida creada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  createMedida(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateMedidaDto) {
    return this.extrasService.createMedida(id, dto);
  }

  @Patch('medidas/:medidaId')
  @ApiOperation({
    summary: 'Editar una medida alterna',
    description:
      'No permitido sobre la medida base (factorABase = 1): romperla dejaría al insumo sin su unidad de referencia.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiParam({ name: 'medidaId', example: 1, description: 'ID de la medida.' })
  @ApiOkResponse({
    type: MedidaResponseEntity,
    description: 'Medida actualizada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo o medida no encontrada.' })
  @ApiConflictResponse({
    description: 'No se puede editar la medida base del insumo.',
  })
  updateMedida(
    @Param('id', ParseIntPipe) id: number,
    @Param('medidaId', ParseIntPipe) medidaId: number,
    @Body() dto: UpdateMedidaDto,
  ) {
    return this.extrasService.updateMedida(id, medidaId, dto);
  }

  @Delete('medidas/:medidaId')
  @ApiOperation({
    summary: 'Eliminar una medida alterna',
    description:
      'No permitido sobre la medida base ni si la medida está en uso (recetas, catálogo de proveedor, distribuciones o movimientos).',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiParam({ name: 'medidaId', example: 1, description: 'ID de la medida.' })
  @ApiOkResponse({
    type: MedidaDeletedEntity,
    description: 'Medida eliminada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo o medida no encontrada.' })
  @ApiConflictResponse({
    description:
      'Medida base o medida en uso (recetas, proveedor, distribución, movimientos).',
  })
  removeMedida(
    @Param('id', ParseIntPipe) id: number,
    @Param('medidaId', ParseIntPipe) medidaId: number,
  ) {
    return this.extrasService.removeMedida(id, medidaId);
  }

  // ---------- Validación de eliminación ----------

  @Get('eliminable')
  @ApiOperation({
    summary: 'Evalúa si el insumo se puede eliminar',
    description:
      'Revisa los 3 criterios: stock en cero en todos los almacenes, sin órdenes de abasto emitidas pendientes y sin recetas activas (Ingredientes_Plato).',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: EliminableResponseEntity,
    description: 'Evaluación de los 3 criterios.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  getEliminable(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getEliminable(id);
  }

  // ---------- Alertas de stock ----------

  @Get('alertas')
  @ApiOperation({
    summary: 'Alerta global y alertas por almacén del insumo',
    description:
      '`global` es el umbral de reabastecimiento externo (compra a proveedor, sobre el stock total). `porAlmacen` son umbrales de reabastecimiento interno (traslados). `global` es null si no está configurada.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: SupplyAlertasResponseEntity,
    description: 'Alertas del insumo.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  getAlertas(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getAlertasByInsumo(id);
  }

  @Put('alertas/global')
  @ApiOperation({
    summary: 'Crear o actualizar la alerta global',
    description:
      'Reabastecimiento externo: si el stock total (SUM Stock_Almacen) baja de `stock_min`, se sugiere compra.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: AlertaGlobalResponseEntity,
    description: 'Alerta global guardada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  upsertAlertaGlobal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertAlertaGlobalDto,
  ) {
    return this.extrasService.upsertAlertaGlobal(id, dto);
  }

  @Delete('alertas/global')
  @ApiOperation({ summary: 'Eliminar la alerta global del insumo' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: AlertaDeletedEntity,
    description: 'Alerta global eliminada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo o alerta no encontrada.' })
  removeAlertaGlobal(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.removeAlertaGlobal(id);
  }

  @Put('alertas/almacen')
  @ApiOperation({
    summary: 'Crear o actualizar la alerta por almacén',
    description:
      'Reabastecimiento interno: si el stock del almacén baja de `minimo_alerta`, se sugiere traslado. Se identifica por (id_insumo, id_almacen).',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiOkResponse({
    type: AlertaAlmacenResponseEntity,
    description: 'Alerta por almacén guardada.',
  })
  @ApiNotFoundResponse({ description: 'Insumo no encontrado.' })
  @ApiBadRequestResponse({
    description: 'DTO inválido o almacén inexistente.',
  })
  upsertAlertaAlmacen(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertAlertaAlmacenDto,
  ) {
    return this.extrasService.upsertAlertaAlmacen(id, dto);
  }

  @Delete('alertas/almacen/:almacenId')
  @ApiOperation({ summary: 'Eliminar la alerta de un almacén específico' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del insumo.' })
  @ApiParam({ name: 'almacenId', example: 1, description: 'ID del almacén.' })
  @ApiOkResponse({
    type: AlertaDeletedEntity,
    description: 'Alerta por almacén eliminada.',
  })
  @ApiNotFoundResponse({ description: 'Alerta no encontrada.' })
  removeAlertaAlmacen(
    @Param('id', ParseIntPipe) id: number,
    @Param('almacenId', ParseIntPipe) almacenId: number,
  ) {
    return this.extrasService.removeAlertaAlmacen(id, almacenId);
  }
}
