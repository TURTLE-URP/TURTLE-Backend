import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { usuario_tipo, trabajador_rol } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email!: string;

  @IsEnum(usuario_tipo, { message: 'Tipo de usuario inválido (debe ser trabajador o cliente_digital)' })
  tipo_usuario!: usuario_tipo;

  // Campos opcionales para la creación inicial si el usuario es de tipo trabajador
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(trabajador_rol)
  rol?: trabajador_rol;
}