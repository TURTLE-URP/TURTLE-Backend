import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDetailOnlyDto {
  @ApiProperty({ description: 'ID del plato', example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 25.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  subtotal!: number;

  @ApiProperty({ description: 'IGV del detalle', example: 4.59, minimum: 0 })
  @IsNumber()
  @Min(0)
  igv!: number;
}

export class UpdatePaymentDetailDto {
  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ example: 30, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotal?: number;

  @ApiPropertyOptional({ description: 'IGV del detalle', example: 5.4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  igv?: number;
}
