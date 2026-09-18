import { IsString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkerDto {
  @ApiPropertyOptional({
    description: 'Nombre(s) del trabajador',
    example: 'Miguel Ohara',
  })
  @Optional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Apellido(s) del trabajador',
    example: 'De La Puerta',
  })
  @Optional()
  @IsString()
  lastName?: string;
}
