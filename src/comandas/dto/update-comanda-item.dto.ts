import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateComandaItemDto {
  @ApiPropertyOptional({ description: 'Nueva cantidad', example: 3, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Notas para cocina',
    example: 'Extra salsa',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
