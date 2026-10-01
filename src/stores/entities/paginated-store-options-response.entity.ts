import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StoreOptionEntity } from './store-option.entity';
import { CursorPaginationMeta } from '@src/common/entities/cursor-pagination-meta.entity';

export class PaginatedStoreOptionsResponse {
  @ApiProperty({
    type: [StoreOptionEntity],
    description: 'Opciones de almacenes para el combobox.',
  })
  @Expose()
  @Type(() => StoreOptionEntity)
  data!: StoreOptionEntity[];

  @ApiProperty({
    type: CursorPaginationMeta,
    description: 'Información de paginación por cursor.',
  })
  @Expose()
  @Type(() => CursorPaginationMeta)
  meta!: CursorPaginationMeta;
}
