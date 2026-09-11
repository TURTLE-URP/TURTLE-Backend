import { IsEnum, IsString, MinLength } from 'class-validator';
import { worker_role_type } from '@src/generated/prisma/client';

export class CreateWorkerDto {
  @IsString()
  name!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(worker_role_type)
  role!: worker_role_type;
}
