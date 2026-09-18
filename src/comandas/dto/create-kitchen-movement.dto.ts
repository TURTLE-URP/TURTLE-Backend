import { IsInt, IsEnum, Min } from 'class-validator';
// import { kitchen_movement_status } from '@src/generated/prisma/client';

export class CreateKitchenMovementDto {
  // @IsEnum(kitchen_movement_status)
  // status!: kitchen_movement_status;

  @IsInt()
  @Min(1)
  quantity!: number;
}
