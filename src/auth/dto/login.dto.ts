import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario.',
    example: 'mozo@turtle.pe',
  })
  @Transform(({value})=>value?.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario.',
    example: 'changeme',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
