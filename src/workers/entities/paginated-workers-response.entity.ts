import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { WorkerResponseEntity } from './worker-response.entity';
import { PaginationMeta } from '@src/common/entities/pagination-meta.entity';

export class PaginatedWorkersResponse {
  @ApiProperty({
    type: [WorkerResponseEntity],
    description: 'Lista de trabajadores de la página actual.',
  })
  @Expose()
  @Type(() => WorkerResponseEntity)
  data!: WorkerResponseEntity[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Información de paginación.',
  })
  @Expose()
  @Type(() => PaginationMeta)
  meta!: PaginationMeta;
}
