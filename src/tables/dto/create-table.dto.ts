import { ApiProperty } from '@nestjs/swagger';
import { mesa_piso } from '@prisma/client';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 7, minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  numero!: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  capacidad!: number;

  @ApiProperty({ enum: mesa_piso, example: mesa_piso.piso_1 })
  @IsEnum(mesa_piso)
  piso!: mesa_piso;
}
