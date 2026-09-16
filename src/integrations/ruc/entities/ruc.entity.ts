import { ApiProperty } from '@nestjs/swagger';

export class RucLookup {
  @ApiProperty({ example: '20100047218' })
  ruc: string;

  @ApiProperty({ example: 'EMPRESA EJEMPLO S.A.C.' })
  razonSocial: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty({ example: 'HABIDO' })
  condicion: string;

  @ApiProperty({ example: 'AV. EJEMPLO 123, LIMA' })
  direccion: string;

  @ApiProperty({ example: '150101', nullable: true })
  ubigeo: string | null;

  @ApiProperty({ example: 'SUNAT' })
  source: string;

  @ApiProperty({ example: '2026-09-16', nullable: true })
  asOf: string | null;

  constructor(
    ruc: RucLookup['ruc'],
    razonSocial: RucLookup['razonSocial'],
    estado: RucLookup['estado'],
    condicion: RucLookup['condicion'],
    direccion: RucLookup['direccion'],
    ubigeo: RucLookup['ubigeo'],
    source: RucLookup['source'],
    asOf: RucLookup['asOf'],
  ) {
    this.ruc = ruc;
    this.razonSocial = razonSocial;
    this.estado = estado;
    this.condicion = condicion;
    this.direccion = direccion;
    this.ubigeo = ubigeo;
    this.source = source;
    this.asOf = asOf;
  }
}
