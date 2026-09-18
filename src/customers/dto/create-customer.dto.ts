import { ApiProperty } from '@nestjs/swagger';
import { cliente_auth_provider } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Correo electronico del cliente',
    example: 'hjuan225@outlook.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Humberto Juan Gutierrez Vega',
  })
  @IsString()
  nombre_completo!: string;

  @ApiProperty({
    description: 'Proveedor de Identidad utilizado',
    example: 'google',
  })
  @IsEnum(cliente_auth_provider)
  auth_provider!: cliente_auth_provider;

  @ApiProperty({
    description: 'ID otorgado por el proveedor',
    example: '121645156',
  })
  @IsString()
  provider_user_id!: string;
}
