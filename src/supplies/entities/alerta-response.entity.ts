import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AlertaGlobalResponseEntity {
  @ApiProperty({ description: 'ID de la alerta global.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Stock mínimo total antes de sugerir compra.' })
  @Expose()
  stockMin!: number;

  @ApiPropertyOptional({ description: 'Stock deseado tras la reposición.' })
  @Expose()
  stockDeseado!: number | null;
}

export class AlertaAlmacenResponseEntity {
  @ApiProperty({ description: 'ID de la alerta por almacén.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'ID del almacén.' })
  @Expose()
  idAlmacen!: number;

  @ApiProperty({ description: 'Código del almacén.', example: 'ALM-001' })
  @Expose()
  codigoAlmacen!: string;

  @ApiProperty({ description: 'Nombre del almacén.' })
  @Expose()
  nombreAlmacen!: string;

  @ApiProperty({ description: 'Si el stock baja de esto, se sugiere traslado.' })
  @Expose()
  minimoAlerta!: number;

  @ApiPropertyOptional({ description: 'Cantidad sugerida a trasladar.' })
  @Expose()
  cantidadReponer!: number | null;
}

export class SupplyAlertasResponseEntity {
  @ApiProperty({
    type: AlertaGlobalResponseEntity,
    nullable: true,
    description: 'Alerta global (reabastecimiento externo). Null si no configurada.',
  })
  @Expose()
  @Type(() => AlertaGlobalResponseEntity)
  global!: AlertaGlobalResponseEntity | null;

  @ApiProperty({
    type: [AlertaAlmacenResponseEntity],
    description: 'Alertas por almacén (reabastecimiento interno).',
  })
  @Expose()
  @Type(() => AlertaAlmacenResponseEntity)
  porAlmacen!: AlertaAlmacenResponseEntity[];
}

export class AlertaDeletedEntity {
  @ApiProperty({ description: 'ID del insumo.' })
  @Expose()
  idInsumo!: number;

  @ApiPropertyOptional({ description: 'ID del almacén (solo alerta por almacén).' })
  @Expose()
  idAlmacen!: number | null;

  @ApiProperty({ description: 'Mensaje de confirmación.' })
  @Expose()
  message!: string;
}
