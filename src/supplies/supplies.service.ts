import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { FindSuppliesQueryDto } from './dto/find-supplies-query.dto';
import {
  toPaginatedResponse,
  toResponse,
} from '@src/common/utils/serializer.util';
import { SupplyResponseEntity } from './entities/supply-response.entity';
import { PaginatedSuppliesResponse } from './entities/paginated-supplies-response.entity';
import { SupplyDeletedEntity } from './entities/supply-deleted.entity';

// No hay columna de stock global en Insumo: el stock global es
// SUM(Stock_Almacen.stock_actual). No se expone detalle por almacén.
const include = {
  unidad_base: { select: { id: true, nombre: true, abreviatura: true } },
};

type SupplyRow = {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  unidad_base: { id: number; nombre: string; abreviatura: string };
};

function toSupplyResponse(
  row: SupplyRow,
  stockActual: number,
): SupplyResponseEntity {
  return {
    id: row.id,
    codigo: row.codigo,
    nombre: row.nombre,
    descripcion: row.descripcion ?? null,
    unidadBase: row.unidad_base,
    stockActual,
  };
}

@Injectable()
export class SuppliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSupplyDto): Promise<SupplyResponseEntity> {
    try {
      const count = await this.prisma.insumo.count();
      const codigo = 'INS-' + String(count + 1).padStart(3, '0');
      const insumo = await this.prisma.insumo.create({
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          id_unidad_base: dto.id_unidad_base,
          codigo,
          created_by: 999999,
        },
        include,
      });

      // Recién creado: sin stocks todavía.
      return toResponse(
        SupplyResponseEntity,
        toSupplyResponse(insumo as unknown as SupplyRow, 0),
      );
    } catch (e) {
      this.handleDbError(e);
    }
  }

  async findAll(
    query: FindSuppliesQueryDto,
  ): Promise<PaginatedSuppliesResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where = {
      deleted_at: null,
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' as const } },
          { codigo: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.insumo.findMany({
        where,
        include,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.insumo.count({ where }),
    ]);

    // Stock global en una sola query (sin traer detalle por almacén).
    const ids = rows.map((r) => r.id);
    const sums = ids.length
      ? await this.prisma.stock_Almacen.groupBy({
          by: ['id_insumo'],
          where: { id_insumo: { in: ids } },
          _sum: { stock_actual: true },
        })
      : [];
    const stockByInsumo = new Map(
      sums.map((s) => [s.id_insumo, Number(s._sum.stock_actual ?? 0)]),
    );

    const items = rows.map((r) =>
      toSupplyResponse(
        r as unknown as SupplyRow,
        stockByInsumo.get(r.id) ?? 0,
      ),
    );

    return toPaginatedResponse(
      PaginatedSuppliesResponse,
      items,
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<SupplyResponseEntity> {
    const insumo = await this.prisma.insumo.findFirst({
      where: { id, deleted_at: null },
      include,
    });
    if (!insumo) throw new NotFoundException(`Insumo ${id} no encontrado`);
    const stockActual = await this.getGlobalStock(id);
    return toResponse(
      SupplyResponseEntity,
      toSupplyResponse(insumo as unknown as SupplyRow, stockActual),
    );
  }

  async update(
    id: number,
    dto: UpdateSupplyDto,
  ): Promise<SupplyResponseEntity> {
    await this.findOne(id);
    try {
      const insumo = await this.prisma.insumo.update({
        where: { id },
        data: { ...dto, updated_at: new Date() },
        include,
      });
      const stockActual = await this.getGlobalStock(id);
      return toResponse(
        SupplyResponseEntity,
        toSupplyResponse(insumo as unknown as SupplyRow, stockActual),
      );
    } catch (e) {
      this.handleDbError(e);
    }
  }

  private async getGlobalStock(id_insumo: number): Promise<number> {
    const agg = await this.prisma.stock_Almacen.aggregate({
      where: { id_insumo },
      _sum: { stock_actual: true },
    });
    return Number(agg._sum.stock_actual ?? 0);
  }

  // Borrado lógico: el insumo puede estar referenciado por ingredientes, stock, etc.
  async remove(id: number): Promise<SupplyDeletedEntity> {
    await this.findOne(id);
    await this.prisma.insumo.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return toResponse(SupplyDeletedEntity, {
      id,
      message: `Insumo ${id} eliminado`,
    });
  }

  private handleDbError(e: unknown): never {
    const code = (e as { code?: string })?.code;
    if (code === 'P2002')
      throw new ConflictException('Ya existe un insumo con ese código');
    if (code === 'P2003')
      throw new BadRequestException('La unidad base indicada no existe');
    throw e;
  }
}
