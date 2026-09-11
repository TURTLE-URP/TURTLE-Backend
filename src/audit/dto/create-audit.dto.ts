import { IsEnum, IsInt, IsString } from 'class-validator';
import { audit_action_type } from '@src/generated/prisma/client';

export class CreateAuditDto {
  @IsInt()
  userId!: number;

  @IsEnum(audit_action_type)
  action!: audit_action_type;

  @IsString()
  affectedTable!: string;

  @IsString()
  rowId!: string;

  @IsString()
  ipAddress!: string;

  @IsString()
  userAgent!: string;
}
