import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CriterioEliminableEntity {
  @ApiProperty({
    enum: ['stock_en_cero', 'sin_ordenes_pendientes', 'sin_recetas_activas'],
  })
  @Expose()
  criterio!: string;

  @ApiProperty({ description: 'Si cumple el criterio.' })
  @Expose()
  cumple!: boolean;

  @ApiProperty({ description: 'Detalle legible del criterio.' })
  @Expose()
  detalle!: string;
}

export class EliminableResponseEntity {
  @ApiProperty({ description: 'ID del insumo evaluado.' })
  @Expose()
  idInsumo!: number;

  @ApiProperty({ description: 'Código del insumo.', example: 'INS-0001' })
  @Expose()
  codigo!: string;

  @ApiProperty({ description: 'Nombre del insumo.' })
  @Expose()
  nombre!: string;

  @ApiProperty({ description: 'True solo si cumple los 3 criterios.' })
  @Expose()
  eliminable!: boolean;

  @ApiProperty({ type: [CriterioEliminableEntity] })
  @Expose()
  @Type(() => CriterioEliminableEntity)
  criterios!: CriterioEliminableEntity[];
}
