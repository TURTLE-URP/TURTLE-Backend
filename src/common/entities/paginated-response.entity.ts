import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Expose, Type } from 'class-transformer';
import { PaginationMeta } from './pagination-meta.entity';

export function PaginatedResponse<T>(
  resource: ClassConstructor<T>,
  dataDescription?: string,
) {
  abstract class PaginatedResponseHost {
    @ApiProperty({
      type: [resource],
      description: dataDescription ?? 'Registros de la página actual.',
    })
    @Expose()
    @Type(() => resource) // captura `resource` por closure, sí funciona
    data!: T[];

    @ApiProperty({
      type: PaginationMeta,
      description: 'Información de paginación.',
    })
    @Expose()
    @Type(() => PaginationMeta)
    meta!: PaginationMeta;
  }
  return PaginatedResponseHost;
}
