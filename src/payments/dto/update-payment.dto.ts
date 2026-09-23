import { ApiPropertyOptional } from '@nestjs/swagger';
import { pago_medio_pago } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ enum: pago_medio_pago })
  @IsOptional()
  @IsEnum(pago_medio_pago)
  medioPago?: pago_medio_pago;

  @ApiPropertyOptional({ example: 60, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monto?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlComprobante?: string;
}
