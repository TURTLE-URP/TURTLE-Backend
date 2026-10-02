import { ApiPropertyOptional } from '@nestjs/swagger';
import { mesa_piso } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateTableManagementDto {
  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 99 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  numero?: number;

  @ApiPropertyOptional({ example: 6, minimum: 1, maximum: 99 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  capacidad?: number;

  @ApiPropertyOptional({ enum: mesa_piso, example: mesa_piso.piso_2 })
  @IsOptional()
  @IsEnum(mesa_piso)
  piso?: mesa_piso;
}
