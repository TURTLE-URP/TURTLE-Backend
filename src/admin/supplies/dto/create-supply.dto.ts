import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSupplyDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsNumber()
  unitOfMeasurementId!: number;

  @IsNumber()
  maxStock!: number;

  @IsOptional()
  @IsNumber()
  minStock?: number;

  @IsOptional()
  @IsNumber()
  currentStock?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  storageRoomIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateSupplyDto extends PartialType(CreateSupplyDto) {}
