import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateSupplyDto } from './create-supply.dto';

export class UpdateSupplyDto extends PartialType(
  OmitType(CreateSupplyDto, ['created_by'] as const),
) {
  // TEMPORAL: cuando se saque del token (JWT), eliminar este campo
  @ApiPropertyOptional({
    example: 1,
    description: 'ID del usuario que edita (temporal)',
  })
  @IsOptional()
  @IsInt()
  updated_by?: number;
}
