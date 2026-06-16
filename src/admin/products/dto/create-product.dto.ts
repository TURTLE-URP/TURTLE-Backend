import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { menu_item_status_type, menu_item_type } from '@src/generated/prisma/client';

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
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
