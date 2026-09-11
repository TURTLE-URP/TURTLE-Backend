import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateComandaItemOnlyDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
