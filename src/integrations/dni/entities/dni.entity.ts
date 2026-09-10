export class DniLookup {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
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
