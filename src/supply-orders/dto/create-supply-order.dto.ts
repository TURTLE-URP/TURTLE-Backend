import {
  IsArray,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
// import { supply_order_modality_type } from '@src/generated/prisma/client';

export class SupplyOrderItemDto {
  @IsNumber()
  supplierCatalogItemId!: number;

  @IsNumber()
  @Min(0.001)
  quantity!: number;
}

export class CreateSupplyOrderDto {
  // @IsEnum(supply_order_modality_type)
  // modality!: supply_order_modality_type;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplyOrderItemDto)
  items!: SupplyOrderItemDto[];
}

export class DishDemandDto {
  @IsNumber()
  dishId!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CalculateByDishesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishDemandDto)
  items!: DishDemandDto[];
}
