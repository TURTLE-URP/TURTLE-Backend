import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindStoresOptionsQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre o código (folio) del almacén.',
    example: 'ALM-001',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description:
      'Cursor para paginación. ID del último almacén visto. Omitir en la primera carga.',
    example: 45,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cursor?: number;

  @ApiPropertyOptional({
    description: 'Registros por carga, máx 50.',
    example: 5,
    default: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 5;
}
