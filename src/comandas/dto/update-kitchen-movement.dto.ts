import { IsEnum } from 'class-validator';
import { kitchen_movement_status } from '@src/generated/prisma/client';

export class UpdateKitchenMovementDto {
  @IsEnum(kitchen_movement_status)
  status!: kitchen_movement_status;
}
