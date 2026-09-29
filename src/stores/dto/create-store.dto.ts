import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@src/common/decorators/trim.decorator';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStoreDTO {
  @ApiProperty({ description: 'Nombre del almacén.' })
  @Trim()
  @MinLength(3, {
    message: 'El nombre es demasiado corto (Min. 3 caracteres).',
  })
  @MaxLength(100, {
    message: 'El nombre es demasiado largo (Max. 100 caracteres).',
  })
  @IsString()
  nombre!: string;

  @ApiProperty({ description: 'Descripción del almacén' })
  @Trim()
  @MinLength(3, {
    message: 'Descripción demasiado corta (Min. 3 caracteres).',
  })
  @IsString()
  descripcion!: string;

  @ApiProperty({
    description: 'Referencia dentro del restaurante para ubicar el almacén.',
  })
  @Trim()
  @MinLength(3, {
    message: 'Ubicación demasiado corta (Min. 3 caracteres).',
  })
  @IsString()
  ubicacion!: string;
}
