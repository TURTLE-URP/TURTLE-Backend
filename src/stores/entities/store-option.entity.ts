import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreOptionEntity {
  @ApiProperty({ description: 'ID del almacén en el sistema.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Código (folio) de negocio del almacén.' })
  @Expose()
  codigo!: string;

  @ApiProperty({ description: 'Nombre del almacén.' })
  @Expose()
  nombre!: string;
}
