import { IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Código interno único del proveedor',
    example: 'PROV-001',
  })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiProperty({
    description: 'RUC del proveedor (11 dígitos numéricos, único)',
    example: '20123456789',
    minLength: 11,
    maxLength: 11,
  })
  @IsString()
  @Length(11, 11)
  @Matches(/^\d+$/, { message: 'El RUC debe contener solo números' })
  ruc!: string;

  @ApiProperty({
    description: 'Razón social del proveedor',
    example: 'Distribuidora Andina S.A.C.',
  })
  @IsString()
  @IsNotEmpty()
  razon_social!: string;

  @ApiProperty({
    description: 'Estado del proveedor en el sistema',
    example: 'ACTIVO',
  })
  @IsString()
  @IsNotEmpty()
  estado!: string;

  @ApiProperty({
    description: 'Condición del contribuyente según SUNAT',
    example: 'HABIDO',
  })
  @IsString()
  @IsNotEmpty()
  condicion!: string;

  @ApiProperty({
    description: 'Dirección fiscal del proveedor',
    example: 'Av. Javier Prado Este 1234, San Isidro, Lima',
  })
  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @ApiProperty({
    description: 'Id del trabajador que registra al proveedor',
    example: 1,
  })
  @IsInt()
  created_by!: number;
}