import { IsEnum } from 'class-validator';
// import {
//   customer_order_status_type,
//   customer_order_item_status_type,
// } from '@src/generated/prisma/client';

export class UpdateOrderStatusDto {
  // @IsEnum(customer_order_status_type)
  // status!: customer_order_status_type;
}

export class UpdateOrderItemStatusDto {
  // @IsEnum(customer_order_item_status_type)
  // status!: customer_order_item_status_type;
}
