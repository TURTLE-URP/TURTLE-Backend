import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDetailOnlyDto {
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

export class UpdatePaymentDetailDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;
}
