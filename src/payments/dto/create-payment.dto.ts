import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { pago_medio_pago } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentDetailDto {
  @ApiProperty({ description: 'ID del plato', example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 30.0, minimum: 0 })
  @IsNumber()
  @Min(0)
  subtotal!: number;

  @ApiProperty({ description: 'IGV del detalle', example: 5.4, minimum: 0 })
  @IsNumber()
  @Min(0)
  igv!: number;
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID del pedido', example: 1 })
  @IsInt()
  pedidoId!: number;

  @ApiProperty({ enum: pago_medio_pago, example: pago_medio_pago.yape })
  @IsEnum(pago_medio_pago)
  medioPago!: pago_medio_pago;

  @ApiProperty({ example: 52.86, minimum: 0 })
  @IsNumber()
  @Min(0)
  monto!: number;

  @ApiPropertyOptional({
    description: 'URL del comprobante (p. ej. Cloudinary)',
  })
  @IsOptional()
  @IsString()
  urlComprobante?: string;

  @ApiProperty({ type: [CreatePaymentDetailDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDetailDto)
  @IsArray()
  @ArrayMinSize(1)
  details!: CreatePaymentDetailDto[];
}
