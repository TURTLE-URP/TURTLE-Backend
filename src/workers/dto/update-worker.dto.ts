import { IsString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkerDto {
  @ApiProperty({
    description: 'Nombre(s) del trabajador',
    example: 'Miguel Ohara',
  })
  @Optional()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Apellido(s) del trabajador',
    example: 'De La Puerta',
  })
  @Optional()
  @IsString()
  lastName!: string;
}
