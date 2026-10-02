import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FindSuppliersQueryDto } from './dto/find-suppliers-query.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSupplierDto) {
    const count = await this.prisma.proveedor.count();
    const codigo = 'PRO-' + String(count + 1).padStart(3, '0');
    try {
      return await this.prisma.proveedor.create({
        data: { ...dto, codigo, created_by: 999999 },
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async findAll(query: FindSuppliersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const whereANDInput: Prisma.ProveedorWhereInput[] = [{ deleted_at: null }];

    if (query.search) {
      whereANDInput.push({
        OR: [
          { razon_social: { contains: query.search, mode: 'insensitive' } },
          { codigo: { contains: query.search, mode: 'insensitive' } },
          { ruc: { contains: query.search } },
        ],
      });
    }

    const where: Prisma.ProveedorWhereInput = { AND: whereANDInput };

    const [data, total] = await Promise.all([
      this.prisma.proveedor.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.proveedor.count({ where }),
    ]);

    // usa aquí el mismo formato de retorno que el findAll de stores
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const proveedor = await this.prisma.proveedor.findFirst({
      where: { id, deleted_at: null },
    });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado.');
    return proveedor;
  }

  async update(id: number, dto: UpdateSupplierDto, userId: number) {
    await this.findOne(id); // lanza 404 si no existe
    try {
      return await this.prisma.proveedor.update({
        where: { id },
        data: { ...dto, updated_at: new Date(), updated_by: userId },
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    await this.findOne(id);
    return this.prisma.proveedor.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }

  private handleUniqueError(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Código o RUC ya registrado.');
    }
  }
}
