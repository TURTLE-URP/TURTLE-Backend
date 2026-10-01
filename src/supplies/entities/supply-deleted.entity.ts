import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SupplyDeletedEntity {
  @ApiProperty({ description: 'ID del insumo borrado.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Mensaje de confirmación' })
  @Expose()
  message!: string;
}
