import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { trabajador_rol } from '@prisma/client';

export class TrabajadorResponse {
  @ApiProperty({ description: 'Nombre(s) del trabajador.' })
  @Expose()
  nombre!: string;

  @ApiProperty({ description: 'Apellido(s) del trabajador.' })
  @Expose()
  apellido!: string;

  @ApiProperty({ enum: trabajador_rol, description: 'Rol del trabajador.' })
  @Expose()
  rol!: trabajador_rol;

  @ApiProperty({
    description:
      'Determina si el usuario puede acceder al sistema o no (no confundir con eliminación del usuario).',
  })
  @Expose()
  activo!: boolean;
}

export class WorkerResponseEntity {
  @ApiProperty({ description: 'ID del usuario trabajador.' })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Correo electrónico del usuario trabajador.' })
  @Expose()
  email!: string;

  @ApiProperty({ type: TrabajadorResponse })
  @Expose()
  @Type(() => TrabajadorResponse)
  trabajador!: TrabajadorResponse;
}
