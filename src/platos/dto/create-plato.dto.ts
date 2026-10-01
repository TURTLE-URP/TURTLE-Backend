import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { platos_categoria } from '@prisma/client';

export class CreatePlatoDto {
  @ApiProperty({ example: 'Lomo Saltado' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'Lomo salteado al wok' })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({ example: 38.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio!: number;

  @ApiProperty({ enum: platos_categoria, example: platos_categoria.principal })
  @IsEnum(platos_categoria)
  categoria!: platos_categoria;

  @ApiProperty({ example: 'PLT-001', required: false })
  @IsOptional()
  @IsString()
  codigo?: string;
}