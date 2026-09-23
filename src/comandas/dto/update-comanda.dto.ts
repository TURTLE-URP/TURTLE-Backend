import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateComandaDto {
  @ApiPropertyOptional({
    description: 'Marca la comanda como lista (o vuelve a pendiente)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  listo?: boolean;
}
