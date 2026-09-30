import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CursorPaginationMeta {
  @ApiProperty({
    description: 'Registros solicitados por carga.',
    example: 5,
  })
  @Expose()
  limit!: number;

  @ApiProperty({
    description:
      'Cursor para la siguiente carga (ID del último registro). Null si no hay más.',
    example: 45,
    nullable: true,
  })
  @Expose()
  nextCursor!: number | null;

  @ApiProperty({
    description: 'Indica si quedan más registros por cargar.',
    example: true,
  })
  @Expose()
  hasMore!: boolean;
}
