import { ApiProperty } from '@nestjs/swagger';

export class DniLookup {
  @ApiProperty({ example: '12345678' })
  dni: string;

  @ApiProperty({ example: 'JUAN' })
  nombres: string;

  @ApiProperty({ example: 'PEREZ' })
  apellidoPaterno: string;

  @ApiProperty({ example: 'GARCIA' })
  apellidoMaterno: string;

  @ApiProperty({ example: 'PEREZ GARCIA JUAN' })
  nombreCompleto: string;

  constructor(
    dni: DniLookup['dni'],
    nombres: DniLookup['nombres'],
    apellidoPaterno: DniLookup['apellidoPaterno'],
    apellidoMaterno: DniLookup['apellidoMaterno'],
    nombreCompleto: DniLookup['nombreCompleto'],
  ) {
    this.dni = dni;
    this.nombres = nombres;
    this.apellidoPaterno = apellidoPaterno;
    this.apellidoMaterno = apellidoMaterno;
    this.nombreCompleto = nombreCompleto;
  }
}
