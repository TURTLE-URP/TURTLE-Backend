import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateComandaItemOnlyDto {
  @ApiProperty({ description: 'ID del plato en Platos_Menu', example: 1 })
  @IsInt()
  menuItemId!: number;

  @ApiProperty({ description: 'Cantidad solicitada', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Notas para cocina',
    example: 'Poco picante',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
