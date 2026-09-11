import { IsEmail, IsEnum } from 'class-validator';
import { user_type } from '@src/generated/prisma/client';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsEnum(user_type)
  userType!: user_type;
}
