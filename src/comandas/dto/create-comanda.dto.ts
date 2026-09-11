import {
  IsInt,
  IsString,
  IsArray,
  ArrayMinSize,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComandaItemDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateComandaDto {
  @IsInt()
  customerOrderId!: number;

  @ValidateNested({ each: true })
  @Type(() => CreateComandaItemDto)
  @IsArray()
  @ArrayMinSize(1)
  items!: CreateComandaItemDto[];
}
