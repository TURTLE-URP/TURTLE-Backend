import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const CATEGORIAS = ['postre', 'entrada', 'principal', 'refresco'] as const;
export type Plato_Categoria = typeof CATEGORIAS[number];

export class FilterPlatoDto {
  @ApiPropertyOptional({ description: 'Filtrar por nombre del plato', example: 'Ceviche' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por categoría',
    enum: CATEGORIAS,
    example: 'principal',
  })
  @IsOptional()
  @IsIn(CATEGORIAS)
  categoria?: Plato_Categoria;

  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Cantidad de elementos por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}