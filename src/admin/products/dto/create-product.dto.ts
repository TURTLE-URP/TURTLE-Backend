import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  menu_item_status_type,
  menu_item_type,
} from '@src/generated/prisma/client';

export class MenuItemIngredientDto {
  @IsNumber()
  internalSupplyId!: number;

  @IsNumber()
  @Min(0.0001)
  equivalenceFactor!: number;

  @IsNumber()
  storageRoomToExtractId!: number;
}

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  unitPrice!: number;

  @IsOptional()
  @IsEnum(menu_item_status_type)
  status?: menu_item_status_type;

  @IsOptional()
  @IsEnum(menu_item_type)
  type?: menu_item_type;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemIngredientDto)
  ingredients?: MenuItemIngredientDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
