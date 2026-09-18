import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class PaginationMeta {
  @ApiProperty({
    description: 'Total de registros sin paginar',
    example: 42,
  })
  @Expose()
  total!: number;

  @ApiProperty({ description: 'Página actual, empieza en 1', example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ description: 'Registros por página solicitados', example: 10 })
  @Expose()
  limit!: number;

  @ApiProperty({
    description: 'Total de páginas según total y limit',
    example: 5,
  })
  @Expose()
  totalPages!: number;
}
