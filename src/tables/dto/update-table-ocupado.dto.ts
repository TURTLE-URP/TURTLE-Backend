import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateTableOcupadoDto {
  @ApiProperty({
    description: 'true = mesa ocupada, false = disponible',
    example: true,
  })
  @IsBoolean()
  ocupado!: boolean;
}
