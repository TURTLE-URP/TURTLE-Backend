import { ApiProperty } from '@nestjs/swagger';
import { movimiento_estado } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateKitchenMovementDto {
  @ApiProperty({
    description: 'Nuevo estado del platillo en cocina',
    enum: movimiento_estado,
    example: movimiento_estado.terminado,
  })
  @IsEnum(movimiento_estado)
  estado!: movimiento_estado;
}
