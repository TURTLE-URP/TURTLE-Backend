import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateActivoDto {
  @ApiProperty({
    description:
      'Determina si se va a activar/desactivar el usuario trabajador.',
  })
  @IsBoolean()
  activo!: boolean;
}
