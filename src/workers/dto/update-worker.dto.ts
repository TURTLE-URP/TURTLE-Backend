import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateWorkerDto {
  @ApiPropertyOptional({
    description: 'Nombre(s) del trabajador',
    example: 'Miguel Ohara',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    description: 'Apellido(s) del trabajador',
    example: 'De La Puerta',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  lastName?: string;
}
