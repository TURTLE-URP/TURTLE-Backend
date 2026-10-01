import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Trim } from '@src/common/decorators/trim.decorator';

export class UpdateTableOcupadoDto {
  @ApiProperty({
    description: 'true = mesa ocupada, false = disponible',
    example: true,
  })
  @IsBoolean()
  ocupado!: boolean;

  @ApiPropertyOptional({
    description: 'Nombre del cliente. Obligatorio al ocupar.',
    example: 'Cliente 1',
  })
  @ValidateIf((dto: UpdateTableOcupadoDto) => dto.ocupado === true)
  @Trim()
  @IsString()
  @IsNotEmpty()
  nombreClienteLocal?: string;

  @ApiPropertyOptional({
    description: 'DNI del cliente local',
    example: '12345678',
  })
  @IsOptional()
  @Trim()
  @IsString()
  documentoClienteLocal?: string;

  @ApiPropertyOptional({
    description: 'Cantidad de comensales. Obligatoria al ocupar.',
    example: 3,
    minimum: 1,
  })
  @ValidateIf((dto: UpdateTableOcupadoDto) => dto.ocupado === true)
  @IsInt()
  @Min(1)
  comensales?: number;

  @ApiPropertyOptional({
    description: 'Mozo asignado a la mesa',
    example: 'Roberto Sánchez',
  })
  @IsOptional()
  @Trim()
  @IsString()
  mozo?: string;
}
