import { ApiPropertyOptional } from '@nestjs/swagger';
import { mesa_piso } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';

export enum EstadoRegistroMesa {
  activa = 'activa',
  inactiva = 'inactiva',
}

export class FindTablesManagementQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por código (M-07) o por número de mesa.',
    example: 'M-07',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtra por piso.',
    enum: mesa_piso,
  })
  @IsOptional()
  @IsEnum(mesa_piso)
  piso?: mesa_piso;

  @ApiPropertyOptional({
    description: 'Activas por defecto. Inactivas son las dadas de baja.',
    enum: EstadoRegistroMesa,
    default: EstadoRegistroMesa.activa,
  })
  @IsOptional()
  @IsEnum(EstadoRegistroMesa)
  estado?: EstadoRegistroMesa = EstadoRegistroMesa.activa;
}
