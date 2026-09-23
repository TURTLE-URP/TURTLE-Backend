import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class SupplyOrderItemDto {
  @ApiProperty({
    description: 'ID de Productos_Proveedor',
    example: 1,
  })
  @IsInt()
  productoProveedorId!: number;

  @ApiProperty({
    description: 'Cantidad entera a pedir',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateSupplyOrderDto {
  @ApiProperty({ type: [SupplyOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SupplyOrderItemDto)
  items!: SupplyOrderItemDto[];
}

export class DishDemandDto {
  @ApiProperty({ description: 'ID del plato', example: 1 })
  @IsInt()
  dishId!: number;

  @ApiProperty({ example: 20, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CalculateByDishesDto {
  @ApiProperty({ type: [DishDemandDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DishDemandDto)
  items!: DishDemandDto[];
}
