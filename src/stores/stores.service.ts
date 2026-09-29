import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { FindStoresQueryDto } from './dto/find-stores-query.dto';
import { Prisma } from '@prisma/client';
import {
  toPaginatedResponse,
  toResponse,
} from '@src/common/utils/serializer.util';
import { PaginatedStoresResponse } from './entities/paginated-stores-response.entity';
import { CreateStoreDTO } from './dto/create-store.dto';
import { StoreResponseEntity } from './entities/store-response.entity';
import { UpdateStoreDTO } from './dto/update-store.dto';
import { StoreDeletedEntity } from './entities/store-deleted-response.entity';
@Injectable()
export class StoresService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(query: FindStoresQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const whereANDInput: Prisma.AlmacenWhereInput[] = [{ deleted_at: null }];

    if (query.search) {
      whereANDInput.push({
        OR: [
          { nombre: { contains: query.search, mode: 'insensitive' } },
          { codigo: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    const whereInput: Prisma.AlmacenWhereInput = { AND: whereANDInput };

    const [total, items] = await Promise.all([
      this.prisma.almacen.count({ where: whereInput }),
      this.prisma.almacen.findMany({
        where: whereInput,
        include: {
          _count: { select: { stocks: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const mappedItems = items.map((i) => ({
      ...i,
      cantidadInsumos: i._count.stocks,
    })) satisfies StoreResponseEntity[];

    return toPaginatedResponse(
      PaginatedStoresResponse,
      mappedItems,
      total,
      page,
      limit,
    );
  }

  async create(dto: CreateStoreDTO) {
    const count = await this.prisma.almacen.count();
    const codigo = 'ALM-' + String(count + 1).padStart(3, '0');
    //TODO: Mencionar el id del usuario que crea el registro realmente cuando ya haya autenticacion
    const almacen = await this.prisma.almacen.create({
      data: { codigo, ...dto, created_by: 999999 },
    });

    const response = {
      ...almacen,
      cantidadInsumos: 0,
    } satisfies StoreResponseEntity;

    return toResponse(StoreResponseEntity, response);
  }

  async update(storeId: number, dto: UpdateStoreDTO) {
    const existing = await this.almacenExists(storeId);
    if (!existing) throw new NotFoundException('El almacén no existe.');

    const alreadyDeleted = existing.deleted_at || existing.deleted_by;
    if (alreadyDeleted) throw new NotFoundException('El almacén no existe.');

    const updatedAlmacen = await this.prisma.almacen.update({
      where: {
        id: storeId,
      },
      data: { ...dto, updated_at: new Date(), updated_by: 999999 },
      include: {
        _count: { select: { stocks: true } },
      },
    });

    const mappedAlmacen = {
      ...updatedAlmacen,
      cantidadInsumos: updatedAlmacen._count.stocks,
    } satisfies StoreResponseEntity;

    return toResponse(StoreResponseEntity, mappedAlmacen);
  }

  async delete(storeId: number) {
    const existing = await this.almacenExists(storeId);
    if (!existing) throw new NotFoundException('El almacén no existe.');

    const alreadyDeleted = existing.deleted_at || existing.deleted_by;
    if (alreadyDeleted) throw new NotFoundException('El almacén no existe.');

    const now = new Date();
    await this.prisma.almacen.update({
      where: { id: storeId },
      data: {
        deleted_at: now,
        updated_at: now,
        deleted_by: 999999,
      },
    });

    const response = {
      id: storeId,
      message: `Almacén #${storeId} eliminado.`,
    } satisfies StoreDeletedEntity;

    return toResponse(StoreDeletedEntity, response);
  }

  private async almacenExists(storeId: number) {
    const exists = await this.prisma.almacen.findUnique({
      where: { id: storeId },
    });
    return exists;
  }
}
