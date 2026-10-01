import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreResponseEntity {
  @ApiProperty({ description: 'ID del almacén en el sistema.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Código(Folio) de negocio del almacén.' })
  @Expose()
  codigo!: string;

  @ApiProperty({ description: 'Nombre del almacén.' })
  @Expose()
  nombre!: string;

  @ApiProperty({ description: 'Descripción del almacén' })
  @Expose()
  descripcion!: string;

  @ApiProperty({ description: 'Ubicación del almacén.' })
  @Expose()
  ubicacion!: string;

  @ApiProperty({
    description: 'Cantidad de insumos registrados dentro del almacén.',
  })
  @Expose()
  cantidadInsumos!: number;
}
