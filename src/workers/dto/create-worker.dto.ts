import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { trabajador_rol } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkerDto {
  @ApiProperty({
    description: 'Nombre(s) del trabajador',
    example: 'Miguel Ohara',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Apellido(s) del trabajador',
    example: 'De La Puerta',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'Correo electrónico para el inicio de sesión y recepción de primera contraseña.',
    example: 'miguel@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Rol que ocupará en el sistema',
    example: 'cocinero',
  })
  @IsEnum(trabajador_rol)
  role!: trabajador_rol;
}
