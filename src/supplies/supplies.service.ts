import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

const PAGE_SIZE = 10;

// Datos que necesita la vista: unidad base y stock por almacén
const include = {
  unidad_base: { select: { id: true, nombre: true, abreviatura: true } },
  stocks: {
    select: {
      id_almacen: true,
      stock_actual: true,
      stock_min: true,
      stock_ideal: true,
    },
  },
};

@Injectable()
export class SuppliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSupplyDto) {
    try {
      const insumo = await this.prisma.insumo.create({ data: dto, include });
      return this.withTotals(insumo);
    } catch (e) {
      this.handleDbError(e);
    }
  }

  async findAll(nombre?: string, page = 1) {
    const where = {
      deleted_at: null,
      ...(nombre && {
        nombre: { contains: nombre, mode: 'insensitive' as const },
      }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.insumo.findMany({
        where,
        include,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.insumo.count({ where }),
    ]);

    return {
      data: rows.map((r) => this.withTotals(r)),
      meta: { total, page, lastPage: Math.ceil(total / PAGE_SIZE) || 1 },
    };
  }

  async findOne(id: number) {
    const insumo = await this.prisma.insumo.findFirst({
      where: { id, deleted_at: null },
      include,
    });
    if (!insumo) throw new NotFoundException(`Insumo ${id} no encontrado`);
    return this.withTotals(insumo);
  }

  async update(id: number, dto: UpdateSupplyDto) {
    await this.findOne(id);
    try {
      const insumo = await this.prisma.insumo.update({
        where: { id },
        data: { ...dto, updated_at: new Date() },
        include,
      });
      return this.withTotals(insumo);
    } catch (e) {
      this.handleDbError(e);
    }
  }

  // Borrado lógico: el insumo puede estar referenciado por ingredientes, stock, etc.
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.insumo.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { id, deleted: true };
  }

  // Suma el stock de todos los almacenes y marca si está bajo el mínimo
  private withTotals<
    T extends { stocks: { stock_actual: unknown; stock_min: unknown }[] },
  >(insumo: T) {
    const stock_total = insumo.stocks.reduce(
      (s, x) => s + Number(x.stock_actual),
      0,
    );
    const stock_min_total = insumo.stocks.reduce(
      (s, x) => s + Number(x.stock_min),
      0,
    );
    return {
      ...insumo,
      stock_total,
      bajo_minimo: insumo.stocks.length > 0 && stock_total < stock_min_total,
    };
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
