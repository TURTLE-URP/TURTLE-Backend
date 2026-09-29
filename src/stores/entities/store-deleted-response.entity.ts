import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreDeletedEntity {
  @ApiProperty({ description: 'ID del almacén borrado.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Mensaje de confirmación' })
  @Expose()
  message!: string;
}
