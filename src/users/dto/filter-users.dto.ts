import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { usuario_tipo, trabajador_rol } from '@prisma/client';

export class FilterUsersDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, description: 'Cantidad de registros por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Busca por nombre, apellido o correo' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: usuario_tipo, description: 'Tipo de usuario (trabajador, cliente_digital)' })
  @IsOptional()
  @IsEnum(usuario_tipo)
  tipo?: usuario_tipo;

  @ApiPropertyOptional({ enum: trabajador_rol, description: 'Filtra por rol del trabajador' })
  @IsOptional()
  @IsEnum(trabajador_rol)
  role?: trabajador_rol;

  @ApiPropertyOptional({ description: 'Filtra por estado (true activos, false inactivos)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  activo?: boolean;
}