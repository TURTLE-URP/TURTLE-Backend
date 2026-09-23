import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { pedido_tipo } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID del plato', example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: pedido_tipo, example: pedido_tipo.local })
  @IsEnum(pedido_tipo)
  tipo!: pedido_tipo;

  @ApiPropertyOptional({
    description: 'Número de mesa (requerido si tipo = local)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  tableNumber?: number;

  @ApiPropertyOptional({
    description: 'Nombre del cliente local',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  nombreClienteLocal?: string;

  @ApiPropertyOptional({
    description: 'Documento del cliente local (DNI/RUC)',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  documentoClienteLocal?: string;

  @ApiPropertyOptional({
    description: 'ID de cliente digital autenticado',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  idClienteDigital?: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsArray()
  @ArrayMinSize(1)
  items!: CreateOrderItemDto[];
}
