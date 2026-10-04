import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { FilterPlatoDto } from './dto/filter-plato.dto';

@Injectable()
export class PlatosService {
  constructor(private readonly prisma: PrismaService) {}

  // Listar insumos disponibles para recetas
  async findInsumosParaReceta() {
    return this.prisma.insumo.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true,
        unidad_base: {
          select: {
            id: true,
            nombre: true,
            abreviatura: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  // 1. Crear plato con receta
  async create(dto: CreatePlatoDto, userId?: number) {
    const { ingredientes, imagen, ...datosPlato } = dto;

    return this.prisma.platos_Menu.create({
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
        descripcion: dto.descripcion ?? '',
        imagen_url: dto.imagen_url,
        categoria: dto.categoria ?? 'principal',
        created_by: userId ?? 1,
        ...(ingredientes && ingredientes.length > 0
          ? {
              ingredientes: {
                create: ingredientes.map((ing: any) => {
                  const insumoId = Number(ing.insumo_id ?? ing.id_insumo);
                  const almacenId = Number(
                    ing.almacen_id ?? ing.id_almacen ?? ing.id_almacen_sustraccion,
                  );
                  const cantidad = Number(ing.cantidad ?? ing.quantity ?? 1);
                  return {
                    cantidad,
                    insumo: { connect: { id: insumoId } },
                    almacen: { connect: { id: almacenId } },
                  };
                }),
              },
            }
          : {}),
      },
      include: {
        ingredientes: {
          include: {
            insumo: true,
            almacen: true,
          },
        },
      },
    });
  }

  // 2. Listar platos paginados y filtrados (excluye soft-deleted)
  async findAll(filters: FilterPlatoDto) {
    const { nombre, categoria, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
    };
    if (nombre) {
      where.nombre = { contains: nombre, mode: 'insensitive' };
    }
    if (categoria) {
      where.categoria = categoria;
    }

    const [data, total] = await Promise.all([
      this.prisma.platos_Menu.findMany({
        where,
        skip,
        take: limit,
        include: {
          ingredientes: {
            include: {
              insumo: true,
              almacen: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.platos_Menu.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 3. Obtener plato por ID con detalle de receta (excluye soft-deleted)
  async findOne(id: number) {
    const plato = await this.prisma.platos_Menu.findFirst({
      where: { id, deleted_at: null },
      include: {
        ingredientes: {
          include: {
            insumo: true,
            almacen: true,
          },
        },
      },
    });

    if (!plato) {
      throw new NotFoundException(`Plato con ID ${id} no encontrado`);
    }

    return plato;
  }

  // 4. Actualizar plato y receta
  async update(id: number, dto: UpdatePlatoDto, userId?: number) {
    await this.findOne(id);

    const { ingredientes, imagen, ...datosPlato } = dto;

    return this.prisma.platos_Menu.update({
      where: { id },
      data: {
        ...datosPlato,
        updated_at: new Date(),
        updated_by: userId,
        ...(ingredientes
          ? {
              ingredientes: {
                deleteMany: {},
                create: ingredientes.map((ing: any) => {
                  const insumoId = Number(ing.insumo_id ?? ing.id_insumo);
                  const almacenId = Number(
                    ing.almacen_id ?? ing.id_almacen ?? ing.id_almacen_sustraccion,
                  );
                  const cantidad = Number(ing.cantidad ?? ing.quantity ?? 1);
                  return {
                    cantidad,
                    insumo: { connect: { id: insumoId } },
                    almacen: { connect: { id: almacenId } },
                  };
                }),
              },
            }
          : {}),
      },
      include: {
        ingredientes: {
          include: {
            insumo: true,
            almacen: true,
          },
        },
      },
    });
  }

  // 5. Soft delete — marca deleted_at y deleted_by sin borrar el registro
  async remove(id: number, userId?: number) {
    await this.findOne(id);

    return this.prisma.platos_Menu.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId ?? 1,
      },
    });
  }
}