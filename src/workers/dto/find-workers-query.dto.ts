import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { trabajador_rol } from '@prisma/client';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';

export class FindWorkersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre, apellido o correo (insensible a mayúsculas)',
    example: 'mozo',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtra por rol del trabajador',
    enum: trabajador_rol,
    example: 'mozo',
  })
  @IsOptional()
  @IsEnum(trabajador_rol)
  role?: trabajador_rol;

  @ApiPropertyOptional({
    description: 'Filtra por estado (true activos, false inactivos)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  activo?: boolean;
}
