import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateSupplyOrderWarehouseDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  supplyOrderId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  storageRoomId?: number;
}
