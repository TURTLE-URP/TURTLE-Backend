import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSupplyDto {


  @ApiProperty({ example: 'Arroz' })
  @IsString()
  @MinLength(1)
  nombre!: string;

  @ApiPropertyOptional({ example: 'Arroz extra grano largo' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 1, description: 'ID de la unidad base (Unidad_Medida)' })
  @IsInt()
  id_unidad_base!: number;

  // TEMPORAL: cuando se saque del token (JWT), eliminar este campo
  @ApiProperty({ example: 1, description: 'ID del usuario que crea (temporal)' })
  @IsInt()
  created_by!: number;
}