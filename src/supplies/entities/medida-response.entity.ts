import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MedidaResponseEntity {
  @ApiProperty({ description: 'ID de la medida.' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Saco' })
  @Expose()
  nombre!: string;

  @ApiProperty({ example: 'saco' })
  @Expose()
  abreviatura!: string;

  @ApiProperty({
    example: 50,
    description: 'Factor de conversión a la unidad base.',
  })
  @Expose()
  factorABase!: number;

  @ApiPropertyOptional({
    enum: ['todo', 'receta', 'productos_proveedor'],
    example: 'productos_proveedor',
  })
  @Expose()
  uso!: string | null;
}

export class MedidaDeletedEntity {
  @ApiProperty({ description: 'ID de la medida eliminada.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Mensaje de confirmación.' })
  @Expose()
  message!: string;
}
