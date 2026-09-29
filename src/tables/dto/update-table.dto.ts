import { ApiPropertyOptional } from '@nestjs/swagger';
import { mesa_piso } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateTableDto {
  @ApiPropertyOptional({
    description: 'Nuevo número de mesa',
    example: 4,
    minimum: 1,
    maximum: 99,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  numero?: number;

  @ApiPropertyOptional({
    description: 'Capacidad de comensales',
    example: 4,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

  @ApiPropertyOptional({
    description: 'Piso de la mesa',
    enum: mesa_piso,
    example: mesa_piso.piso_1,
  })
  @IsOptional()
  @IsEnum(mesa_piso)
  piso?: mesa_piso;

  @ApiPropertyOptional({
    description: 'true = mesa ocupada, false = disponible',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  ocupado?: boolean;
}
