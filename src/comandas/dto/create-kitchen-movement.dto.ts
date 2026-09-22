import { ApiProperty } from '@nestjs/swagger';
import { movimiento_estado } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class CreateKitchenMovementDto {
  @ApiProperty({
    description: 'Estado del platillo en cocina',
    enum: movimiento_estado,
    example: movimiento_estado.en_preparacion,
  })
  @IsEnum(movimiento_estado)
  estado!: movimiento_estado;

  @ApiProperty({
    description: 'Cantidad asociada al movimiento',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
