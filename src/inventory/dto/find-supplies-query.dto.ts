import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindSuppliesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  almacenId?: number;
}
