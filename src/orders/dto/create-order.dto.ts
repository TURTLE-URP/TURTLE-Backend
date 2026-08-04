import { IsInt, IsString, IsArray, ArrayMinSize, IsOptional, Min, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { customer_order_type } from '@src/generated/prisma/client';

export class CreateOrderItemDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class CreateOrderDto {
  @IsInt()
  tableNumber!: number;

  @IsString()
  customerName!: string;

  @IsString()
  customerId!: string;

  @IsEnum(customer_order_type)
  orderType!: customer_order_type;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsArray()
  @ArrayMinSize(1)
  items!: CreateOrderItemDto[];
}
