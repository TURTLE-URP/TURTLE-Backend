import { Inject, Injectable } from '@nestjs/common';
import { movimiento_almacen_tipo, Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { FindKardexQueryDto } from './dto/find-kardex-query.dto';

type MovementType = 'entrada' | 'salida' | 'merma';

type MovementRow = Prisma.Movimiento_AlmacenGetPayload<{
  include: {
    stock: { include: { insumo: true; almacen: true } };
    merma: true;
    detalle_distribucion: { include: { distribucion: true } };
    comanda: true;
  };
}>;

@Injectable()
export class InventoryService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listWarehouses() {
    const rows = await this.prisma.almacen.findMany({
      where: { deleted_at: null },
      orderBy: { nombre: 'asc' },
      select: { id: true, codigo: true, nombre: true },
    });

    return rows.map((row) => ({
      id: String(row.id),
      codigo: row.codigo,
      nombre: row.nombre,
    }));
  }

  async listSupplies(almacenId?: number) {
    const rows = await this.prisma.stock_Almacen.findMany({
      where: {
        ...(almacenId ? { id_almacen: almacenId } : {}),
        insumo: { deleted_at: null },
      },
      include: {
        insumo: { include: { unidad_base: true } },
      },
      orderBy: { insumo: { nombre: 'asc' } },
    });

    const grouped = new Map<
      number,
      {
        id: string;
        nombre: string;
        categoria: string;
        unidadMedida: string;
        stockActual: number;
      }
    >();

    for (const row of rows) {
      const current = grouped.get(row.id_insumo);
      const stock = Number(row.stock_actual);
      if (!current) {
        grouped.set(row.id_insumo, {
          id: String(row.insumo.id),
          nombre: row.insumo.nombre,
          categoria: row.insumo.descripcion?.trim() || row.insumo.unidad_base.tipo,
          unidadMedida:
            row.insumo.unidad_base.abreviatura || row.insumo.unidad_base.nombre,
          stockActual: stock,
        });
        continue;
      }
      current.stockActual += stock;
    }

    return [...grouped.values()];
  }

  async listKardex(query: FindKardexQueryDto) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(`${query.to}T23:59:59.999`) : undefined;

    const rows = await this.prisma.movimiento_Almacen.findMany({
      where: {
        stock: {
          id_insumo: query.insumoId,
          ...(query.almacenId ? { id_almacen: query.almacenId } : {}),
        },
        ...(from || to
          ? {
              created_at: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      include: {
        stock: { include: { insumo: true, almacen: true } },
        merma: true,
        detalle_distribucion: { include: { distribucion: true } },
        comanda: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const responsables = await this.loadResponsables(rows);

    return rows
      .map((row) => this.toMovement(row, responsables))
      .filter((row) => !query.tipo || query.tipo === 'todos' || row.tipo === query.tipo);
  }

  private async loadResponsables(rows: MovementRow[]) {
    const ids = [
      ...new Set(
        rows
          .map((row) => row.created_by)
          .filter((id): id is number => typeof id === 'number'),
      ),
    ];
    if (ids.length === 0) {
      return new Map<number, string>();
    }

    const users = await this.prisma.usuario.findMany({
      where: { id: { in: ids } },
      include: { trabajador: true },
    });

    return new Map(
      users.map((user) => [
        user.id,
        user.trabajador
          ? `${user.trabajador.nombre} ${user.trabajador.apellido}`.trim()
          : user.email,
      ]),
    );
  }

  private toMovement(row: MovementRow, responsables: Map<number, string>) {
    const tipo = this.mapTipo(row.tipo, row.saldo_anterior, row.saldo_nuevo);
    return {
      id: String(row.id),
      insumoId: String(row.stock.id_insumo),
      tipo,
      cantidad: Number(row.cantidad),
      // Cambiamos 'saldoResultante' por 'saldo' para que la tabla del frontend lo reconozca
      saldo: Number(row.saldo_nuevo), 
      fecha: row.created_at.toISOString(),
      responsable:
        (row.created_by ? responsables.get(row.created_by) : undefined) ??
        'Sistema',
      documento: this.documentOf(row),
      motivo: this.reasonOf(row, tipo),
    };
  }

  private mapTipo(
    tipo: movimiento_almacen_tipo,
    saldoAnterior: Prisma.Decimal,
    saldoNuevo: Prisma.Decimal,
  ): MovementType {
    if (tipo === 'MERMA') return 'merma';
    if (tipo === 'ENTRADA_DISTRIBUCION') return 'entrada';
    if (tipo === 'SALIDA_COMANDA') return 'salida';
    return Number(saldoNuevo) >= Number(saldoAnterior) ? 'entrada' : 'salida';
  }

  private documentOf(row: MovementRow) {
    if (row.detalle_distribucion?.distribucion?.codigo) {
      return row.detalle_distribucion.distribucion.codigo;
    }
    if (row.comanda?.codigo) return row.comanda.codigo;
    if (row.merma) return `MERMA-${row.merma.id}`;
    return row.tipo;
  }

  private reasonOf(row: MovementRow, tipo: MovementType) {
    if (row.merma?.descripcion) return row.merma.descripcion;
    if (tipo === 'entrada') return 'Entrada por distribución de abasto';
    if (tipo === 'salida') return 'Salida por consumo de comanda';
    return 'Ajuste de inventario';
  }
}
