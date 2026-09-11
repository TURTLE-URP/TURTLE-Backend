import { IsInt, IsPositive } from 'class-validator';

export class CreateSupplyOrderWarehouseDto {
  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsInt()
  @IsPositive()
  supplyOrderId!: number;

  @IsInt()
  @IsPositive()
  storageRoomId!: number;
}
