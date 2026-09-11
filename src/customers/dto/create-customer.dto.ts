import { IsEnum, IsString } from 'class-validator';
import { auth_provider_type } from '@src/generated/prisma/client';

export class CreateCustomerDto {
  @IsString()
  fullName!: string;

  @IsEnum(auth_provider_type)
  authProvider!: auth_provider_type;

  @IsString()
  providerUserId!: string;
}
