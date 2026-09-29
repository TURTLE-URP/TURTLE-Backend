import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// Debe coincidir exactamente con el enum medida_uso del schema
export enum MedidaUso {
  TODO = 'todo',
  RECETA = 'receta',
  PRODUCTOS_PROVEEDOR = 'productos_proveedor',
}

// ---------- Alerta Global (reabastecimiento externo) ----------

export class UpsertAlertaGlobalDto {
  @ApiProperty({ example: 10, description: 'Stock mínimo total antes de sugerir compra' })
  @IsNumber()
  @IsPositive()
  stock_min!: number;

  @ApiPropertyOptional({ example: 30, description: 'Stock deseado tras la reposición (opcional)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock_deseado?: number;

  // TEMPORAL: cuando se saque del token (JWT), eliminar este campo
  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_id!: number;
}

// ---------- Alerta por Almacén (reabastecimiento interno) ----------

export class UpsertAlertaAlmacenDto {
  @ApiProperty({ example: 1, description: 'ID del almacén al que aplica la alerta' })
  @IsInt()
  id_almacen!: number;

  @ApiProperty({ example: 5, description: 'Si el stock del almacén baja de esto, se sugiere traslado' })
  @IsNumber()
  @IsPositive()
  minimo_alerta!: number;

  @ApiPropertyOptional({ example: 10, description: 'Cantidad sugerida a trasladar' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad_reponer?: number;

  // TEMPORAL: cuando se saque del token (JWT), eliminar este campo
  @ApiProperty({ example: 1 })
  @IsInt()
  usuario_id!: number;
}

// ---------- Medidas alternas ----------

export class CreateMedidaDto {
  @ApiProperty({ example: 'Saco' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'saco' })
  @IsString()
  abreviatura!: string;

  @ApiProperty({ example: 50, description: 'Factor de conversión a la unidad base' })
  @IsNumber()
  @IsPositive()
  factor_a_base!: number;

  @ApiPropertyOptional({ enum: MedidaUso, example: MedidaUso.PRODUCTOS_PROVEEDOR })
  @IsOptional()
  @IsEnum(MedidaUso)
  uso?: MedidaUso;
}