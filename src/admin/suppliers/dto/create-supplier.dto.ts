import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { contact_method_type } from '@src/generated/prisma/client';

export class ContactMethodDto {
  @IsEnum(contact_method_type)
  method!: contact_method_type;

  @IsString()
  contact!: string;
}

export class CatalogItemDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsNumber()
  unitPrice!: number;

  @IsOptional()
  @IsNumber()
  conversionFactor?: number;

  @IsNumber()
  unitOfMeasurementId!: number;

  @IsNumber()
  internalSupplyId!: number;
}

export class CreateSupplierDto {
  @IsString()
  ruc!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactMethodDto)
  @IsArray()
  contactMethods?: ContactMethodDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CatalogItemDto)
  @IsArray()
  catalogItems?: CatalogItemDto[];
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
