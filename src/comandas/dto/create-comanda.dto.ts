import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateComandaItemDto {
  @ApiProperty({ description: 'ID del plato en Platos_Menu', example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ description: 'Cantidad solicitada', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Notas para cocina',
    example: 'Sin cebolla',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateComandaDto {
  @ApiProperty({ description: 'ID del pedido', example: 1 })
  @IsInt()
  pedidoId!: number;

  @ApiProperty({ type: [CreateComandaItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateComandaItemDto)
  @IsArray()
  @ArrayMinSize(1)
  items!: CreateComandaItemDto[];
}
