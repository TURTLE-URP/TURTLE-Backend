import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FindUnitsQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre o abreviatura de la unidad.',
    example: 'kg',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}
