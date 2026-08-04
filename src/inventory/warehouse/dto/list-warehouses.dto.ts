import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class ListWarehousesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;
}
