import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { mesa_piso } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { PaginationMeta } from '@src/common/entities/pagination-meta.entity';

export class TableManagementItem {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'M-07' })
  @Expose()
  codigo!: string;

  @ApiProperty({ example: 7 })
  @Expose()
  numero!: number;

  @ApiProperty({ enum: mesa_piso, example: mesa_piso.piso_1 })
  @Expose()
  piso!: mesa_piso;

  @ApiProperty({ example: 4 })
  @Expose()
  capacidad!: number;

  @ApiProperty({ description: 'Solo lectura. Lo define ocupar o liberar la mesa.' })
  @Expose()
  ocupado!: boolean;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  updatedAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  updatedBy!: number | null;

  @ApiProperty({ enum: ['activa', 'inactiva'] })
  @Expose()
  estado!: 'activa' | 'inactiva';

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  motivoBaja!: string | null;
}

export class TableManagementSummary {
  @ApiProperty({ description: 'Mesas activas, sin filtrar.' })
  @Expose()
  activas!: number;

  @ApiProperty({ description: 'Mesas activas del piso 1.' })
  @Expose()
  piso1!: number;

  @ApiProperty({ description: 'Mesas activas del piso 2.' })
  @Expose()
  piso2!: number;

  @ApiProperty({ description: 'Mesas dadas de baja, sin filtrar.' })
  @Expose()
  inactivas!: number;
}

export class PaginatedTableManagementResponse {
  @ApiProperty({ type: [TableManagementItem] })
  @Expose()
  @Type(() => TableManagementItem)
  data!: TableManagementItem[];

  @ApiProperty({ type: PaginationMeta })
  @Expose()
  @Type(() => PaginationMeta)
  meta!: PaginationMeta;

  @ApiProperty({ type: TableManagementSummary })
  @Expose()
  @Type(() => TableManagementSummary)
  summary!: TableManagementSummary;
}
