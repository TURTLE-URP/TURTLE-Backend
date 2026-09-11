import {
  IsArray,
  ArrayMinSize,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { payment_method_type } from '@src/generated/prisma/client';

export class CreatePaymentDetailDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  subtotal!: number;

  @IsNumber()
  @Min(0)
  tax!: number;
}

export class CreatePaymentDto {
  @IsInt()
  customerOrderId!: number;

  @IsEnum(payment_method_type)
  paymentMethod!: payment_method_type;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDetailDto)
  @IsArray()
  @ArrayMinSize(1)
  details!: CreatePaymentDetailDto[];
}
