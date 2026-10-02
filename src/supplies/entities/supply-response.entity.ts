import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SupplyUnitResponseEntity {
  @ApiProperty({ description: 'ID de la unidad en el sistema.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Abreviatura de la unidad.' })
  @Expose()
  abreviatura!: string;

  @ApiProperty({ description: 'Nombre de la unidad.' })
  @Expose()
  nombre!: string;
}

export class SupplyResponseEntity {
  @ApiProperty({ description: 'ID del insumo en el sistema.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Código(Folio) de negocio del insumo.' })
  @Expose()
  codigo!: string;

  @ApiProperty({ description: 'Nombre del insumo.' })
  @Expose()
  nombre!: string;

  @ApiProperty({ description: 'Descripción del insumo', nullable: true })
  @Expose()
  descripcion!: string | null;

  @ApiProperty({ type: SupplyUnitResponseEntity })
  @Expose()
  @Type(() => SupplyUnitResponseEntity)
  unidadBase!: SupplyUnitResponseEntity;

  @ApiProperty({
    description: 'Cantidad de existencias de dicho insumo a nivel global.',
  })
  @Expose()
  stockActual!: number;
}
