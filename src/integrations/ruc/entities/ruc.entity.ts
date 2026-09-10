export class RucLookup {
  ruc: string;
  razonSocial: string;
  estado: string;
  condicion: string;
  direccion: string;
  ubigeo: string | null;
  source: string;
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
