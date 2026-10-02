import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindKardexQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  insumoId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  almacenId?: number;

  @IsOptional()
  @IsIn(['entrada', 'salida', 'merma', 'todos'])
  tipo?: 'entrada' | 'salida' | 'merma' | 'todos';

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
