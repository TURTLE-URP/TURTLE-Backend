import { ApiProperty, ApiPropertyOptional, ApiHideProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class IngredientePlatoDto {
  @ApiProperty({ description: 'ID del insumo', example: 1 })
  @Type(() => Number)
  @IsNumber()
  insumo_id!: number;

  @ApiProperty({ description: 'ID del almacén', example: 1 })
  @Type(() => Number)
  @IsNumber()
  almacen_id!: number;

  @ApiProperty({ description: 'Cantidad requerida (en la unidad base del insumo)', example: 0.250 })
  @Type(() => Number)
  @IsNumber()
  cantidad!: number;
}

export class CreatePlatoDto {
  @ApiProperty({ example: 'Ceviche' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 38 })
  @Type(() => Number)
  @IsNumber()
  precio!: number;

  @ApiPropertyOptional({ example: 'Ceviche con pota' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Archivo de imagen del plato' })
  @IsOptional()
  imagen?: any;

  @ApiPropertyOptional({
    description: 'Arreglo de ingredientes para la receta',
    example: '[{"insumo_id": 1, "almacen_id": 1, "cantidad": 0.25}]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientePlatoDto)
  ingredientes?: IngredientePlatoDto[];

  @ApiHideProperty()
  imagen_url?: string;
}