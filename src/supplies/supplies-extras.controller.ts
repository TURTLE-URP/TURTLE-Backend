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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuppliesExtrasService } from './supplies-extras.service';
import {
  CreateMedidaDto,
  UpdateMedidaDto,
  UpsertAlertaAlmacenDto,
  UpsertAlertaGlobalDto,
} from './dto/supply-extras.dto';

// NOTA: requiere el schema de la propuesta ya aplicado (ver
// propuesta-schema-alertas-stock.md). No registrar este controller en el
// módulo hasta que la migración esté corrida.

@ApiTags('Insumos - Detalle')
@ApiBearerAuth('bearer')
// TODO: agregar los mismos guards/roles que usa SuppliesController
@Controller('supplies/:id')
export class SuppliesExtrasController {
  constructor(private readonly extrasService: SuppliesExtrasService) {}

  // ---------- Medidas alternas ----------

  @Get('medidas')
  @ApiOperation({ summary: 'Listar medidas alternas del insumo' })
  getMedidas(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getMedidas(id);
  }

  @Post('medidas')
  @ApiOperation({ summary: 'Agregar una medida alterna al insumo' })
  createMedida(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateMedidaDto) {
    return this.extrasService.createMedida(id, dto);
  }

  @Patch('medidas/:medidaId')
  @ApiOperation({ summary: 'Editar una medida alterna (no permitido sobre la medida base)' })
  updateMedida(
    @Param('id', ParseIntPipe) id: number,
    @Param('medidaId', ParseIntPipe) medidaId: number,
    @Body() dto: UpdateMedidaDto,
  ) {
    return this.extrasService.updateMedida(id, medidaId, dto);
  }

  @Delete('medidas/:medidaId')
  @ApiOperation({ summary: 'Eliminar una medida alterna (no permitido sobre la medida base)' })
  removeMedida(
    @Param('id', ParseIntPipe) id: number,
    @Param('medidaId', ParseIntPipe) medidaId: number,
  ) {
    return this.extrasService.removeMedida(id, medidaId);
  }

  // ---------- Validación de eliminación ----------

  @Get('eliminable')
  @ApiOperation({ summary: 'Evalúa si el insumo cumple los 3 criterios para eliminarse' })
  getEliminable(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getEliminable(id);
  }

  // ---------- Alertas de stock ----------

  @Get('alertas')
  @ApiOperation({ summary: 'Alerta global y alertas por almacén del insumo' })
  getAlertas(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.getAlertasByInsumo(id);
  }

  @Put('alertas/global')
  @ApiOperation({ summary: 'Crear o actualizar la alerta global (reabastecimiento externo)' })
  upsertAlertaGlobal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertAlertaGlobalDto,
  ) {
    return this.extrasService.upsertAlertaGlobal(id, dto);
  }

  @Delete('alertas/global')
  @ApiOperation({ summary: 'Eliminar la alerta global del insumo' })
  removeAlertaGlobal(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.removeAlertaGlobal(id);
  }

  @Put('alertas/almacen')
  @ApiOperation({ summary: 'Crear o actualizar la alerta por almacén (reabastecimiento interno)' })
  upsertAlertaAlmacen(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertAlertaAlmacenDto,
  ) {
    return this.extrasService.upsertAlertaAlmacen(id, dto);
  }

  @Delete('alertas/almacen/:almacenId')
  @ApiOperation({ summary: 'Eliminar la alerta de un almacén específico' })
  removeAlertaAlmacen(
    @Param('id', ParseIntPipe) id: number,
    @Param('almacenId', ParseIntPipe) almacenId: number,
  ) {
    return this.extrasService.removeAlertaAlmacen(id, almacenId);
  }
}