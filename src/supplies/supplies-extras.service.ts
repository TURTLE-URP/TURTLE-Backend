import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMedidaDto,
  UpdateMedidaDto,
  UpsertAlertaAlmacenDto,
  UpsertAlertaGlobalDto,
} from './dto/supply-extras.dto';

// NOTA: este servicio asume aplicado el schema de la propuesta
// (Alerta_Global, Alerta_Almacen, Insumo_Medidas.uso, Stock_Almacen sin
// stock_min/stock_ideal). No usar hasta que la migración esté aprobada
// y corrida.

@Injectable()
export class SuppliesExtrasService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- 1. Medidas alternas ----------

  async getMedidas(id_insumo: number) {
    await this.assertInsumoExiste(id_insumo);
    return this.prisma.insumo_Medidas.findMany({
      where: { id_insumo },
      select: {
        id: true,
        nombre: true,
        abreviatura: true,
        factor_a_base: true,
        uso: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async createMedida(id_insumo: number, dto: CreateMedidaDto) {
    await this.assertInsumoExiste(id_insumo);
    return this.prisma.insumo_Medidas.create({
      data: { ...dto, id_insumo },
    });
  }

  async updateMedida(id_insumo: number, id_medida: number, dto: UpdateMedidaDto) {
    const medida = await this.assertMedidaExiste(id_insumo, id_medida);
    this.assertNoEsMedidaBase(medida, 'editar');

    return this.prisma.insumo_Medidas.update({
      where: { id: id_medida },
      data: dto,
    });
  }

  async removeMedida(id_insumo: number, id_medida: number) {
    const medida = await this.assertMedidaExiste(id_insumo, id_medida);
    this.assertNoEsMedidaBase(medida, 'eliminar');

    const [enRecetas, enCatalogoProveedor, enDistribucion, enMovimientos, enMermas] =
      await Promise.all([
        this.prisma.ingredientes_Plato.count({ where: { id_medida_insumo: id_medida } }),
        this.prisma.productos_Proveedor.count({ where: { id_insumo_medida: id_medida } }),
        this.prisma.detalles_Distribucion_Abasto.count({
          where: { id_insumo_medida: id_medida },
        }),
        this.prisma.movimiento_Almacen.count({ where: { id_insumo_medida: id_medida } }),
        this.prisma.merma_Insumo.count({ where: { id_insumo_medida: id_medida } }),
      ]);

    const enUso =
      enRecetas + enCatalogoProveedor + enDistribucion + enMovimientos + enMermas;
    if (enUso > 0) {
      throw new ConflictException(
        'No se puede eliminar: la medida está en uso (recetas, catálogo de proveedor, distribuciones o movimientos de almacén).',
      );
    }

    await this.prisma.insumo_Medidas.delete({ where: { id: id_medida } });
    return { id: id_medida, deleted: true };
  }

  // ---------- 2. Validación de eliminación (3 criterios) ----------

  async getEliminable(id_insumo: number) {
    const insumo = await this.assertInsumoExiste(id_insumo);

    const stocks = await this.prisma.stock_Almacen.findMany({
      where: { id_insumo },
      include: { almacen: { select: { nombre: true } } },
    });
    const stockTotal = stocks.reduce((s, x) => s + Number(x.stock_actual), 0);
    const sinStock = stockTotal === 0;
    const detalleStock =
      stocks.length === 0
        ? 'Sin stock registrado en ningún almacén'
        : `Stock_Almacen ${sinStock ? '= 0' : `= ${stockTotal}`} en todos los almacenes` +
          (sinStock
            ? ''
            : ` — actual: ${stockTotal} en ${stocks.length} almacén(es) (` +
              stocks
                .map((s) => `${s.almacen.nombre} (${Number(s.stock_actual)})`)
                .join(' + ') +
              ') → debes ajustar/mermar');

    const ordenesPendientes = await this.prisma.detalles_Orden_Abasto.count({
      where: {
        producto: { id_insumo },
        orden: { estado: 'emitida' },
      },
    });
    const sinOrdenesPendientes = ordenesPendientes === 0;

    const recetas = await this.prisma.ingredientes_Plato.findMany({
      where: { id_insumo },
      include: { plato: { select: { nombre: true } } },
    });
    const sinRecetas = recetas.length === 0;
    const detalleRecetas = sinRecetas
      ? 'Sin recetas activas (Ingredientes_Plato)'
      : `Usado en ${recetas.length} plato(s): ` +
        recetas.map((r) => `${r.plato.nombre} (${Number(r.cantidad)})`).join(', ');

    const criterios = [
      { criterio: 'stock_en_cero', cumple: sinStock, detalle: detalleStock },
      {
        criterio: 'sin_ordenes_pendientes',
        cumple: sinOrdenesPendientes,
        detalle: sinOrdenesPendientes
          ? 'Sin órdenes de abasto pendientes'
          : `${ordenesPendientes} orden(es) de abasto emitida(s) pendiente(s)`,
      },
      { criterio: 'sin_recetas_activas', cumple: sinRecetas, detalle: detalleRecetas },
    ];

    return {
      id_insumo,
      codigo: insumo.codigo,
      nombre: insumo.nombre,
      eliminable: criterios.every((c) => c.cumple),
      criterios,
    };
  }

  // ---------- 3. Alertas de stock ----------

  async getAlertasByInsumo(id_insumo: number) {
    await this.assertInsumoExiste(id_insumo);

    const [global, porAlmacen] = await Promise.all([
      this.prisma.alerta_Global.findUnique({ where: { id_insumo } }),
      this.prisma.alerta_Almacen.findMany({
        where: { id_insumo },
        include: { almacen: { select: { id: true, codigo: true, nombre: true } } },
        orderBy: { id_almacen: 'asc' },
      }),
    ]);

    return { global, por_almacen: porAlmacen };
  }

  async upsertAlertaGlobal(id_insumo: number, dto: UpsertAlertaGlobalDto) {
    await this.assertInsumoExiste(id_insumo);
    const { usuario_id, ...umbrales } = dto;

    return this.prisma.alerta_Global.upsert({
      where: { id_insumo },
      create: { id_insumo, ...umbrales, created_by: usuario_id },
      update: { ...umbrales, updated_by: usuario_id, updated_at: new Date() },
    });
  }

  async upsertAlertaAlmacen(id_insumo: number, dto: UpsertAlertaAlmacenDto) {
    await this.assertInsumoExiste(id_insumo);
    const { id_almacen, usuario_id, ...umbrales } = dto;

    return this.prisma.alerta_Almacen.upsert({
      where: { id_insumo_id_almacen: { id_insumo, id_almacen } },
      create: { id_insumo, id_almacen, ...umbrales, created_by: usuario_id },
      update: { ...umbrales, updated_by: usuario_id, updated_at: new Date() },
    });
  }

  async removeAlertaAlmacen(id_insumo: number, id_almacen: number) {
    await this.prisma.alerta_Almacen.delete({
      where: { id_insumo_id_almacen: { id_insumo, id_almacen } },
    });
    return { id_insumo, id_almacen, deleted: true };
  }

  async removeAlertaGlobal(id_insumo: number) {
    await this.prisma.alerta_Global.delete({ where: { id_insumo } });
    return { id_insumo, deleted: true };
  }

  // ---------- Funciones de evaluación ----------

  // ¿Este almacén necesita traslado interno? (stock local bajo su umbral)
  async necesitaTrasladoInterno(id_insumo: number, id_almacen: number) {
    const [stock, alerta] = await Promise.all([
      this.prisma.stock_Almacen.findUnique({
        where: { id_almacen_id_insumo: { id_almacen, id_insumo } },
      }),
      this.prisma.alerta_Almacen.findUnique({
        where: { id_insumo_id_almacen: { id_insumo, id_almacen } },
      }),
    ]);

    if (!alerta) return { configurado: false, requiere_traslado: false };

    const stockActual = stock ? Number(stock.stock_actual) : 0;
    return {
      configurado: true,
      stock_actual: stockActual,
      minimo_alerta: Number(alerta.minimo_alerta),
      cantidad_reponer: alerta.cantidad_reponer ? Number(alerta.cantidad_reponer) : null,
      requiere_traslado: stockActual < Number(alerta.minimo_alerta),
    };
  }

  // ¿Este insumo necesita compra a proveedor? (stock total bajo su umbral global)
  async necesitaCompraProveedor(id_insumo: number) {
    const [stocks, alerta] = await Promise.all([
      this.prisma.stock_Almacen.findMany({ where: { id_insumo } }),
      this.prisma.alerta_Global.findUnique({ where: { id_insumo } }),
    ]);

    if (!alerta) return { configurado: false, requiere_compra: false };

    const stockTotal = stocks.reduce((s, x) => s + Number(x.stock_actual), 0);
    return {
      configurado: true,
      stock_total: stockTotal,
      stock_min: Number(alerta.stock_min),
      stock_deseado: Number(alerta.stock_deseado),
      requiere_compra: stockTotal < Number(alerta.stock_min),
    };
  }

  private async assertInsumoExiste(id: number) {
    const insumo = await this.prisma.insumo.findFirst({
      where: { id, deleted_at: null },
    });
    if (!insumo) throw new NotFoundException(`Insumo ${id} no encontrado`);
    return insumo;
  }

  private async assertMedidaExiste(id_insumo: number, id_medida: number) {
    await this.assertInsumoExiste(id_insumo);
    const medida = await this.prisma.insumo_Medidas.findFirst({
      where: { id: id_medida, id_insumo },
    });
    if (!medida) {
      throw new NotFoundException(
        `Medida ${id_medida} no encontrada para el insumo ${id_insumo}`,
      );
    }
    return medida;
  }

  // La medida base (factor_a_base = 1) se crea sola al registrar el insumo
  // y no debe editarse ni eliminarse: romperla dejaría al insumo sin su
  // unidad de referencia.
  private assertNoEsMedidaBase(
    medida: { factor_a_base: unknown },
    accion: 'editar' | 'eliminar',
  ) {
    if (Number(medida.factor_a_base) === 1) {
      throw new ConflictException(
        `No se puede ${accion} la medida base del insumo (factor_a_base = 1).`,
      );
    }
  }
}