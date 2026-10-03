import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta a tu PrismaService
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { FilterPlatoDto } from './dto/filter-plato.dto';

@Injectable()
export class PlatosService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Crear plato con receta
  async create(dto: CreatePlatoDto, userId?: number) {
    const { ingredientes, imagen, ...datosPlato } = dto;

    return this.prisma.platos_Menu.create({
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
        descripcion: dto.descripcion ?? '',
        imagen_url: dto.imagen_url,
        categoria: 'principal',
        created_by: userId ?? 1,
        ...(ingredientes && ingredientes.length > 0
          ? {
              ingredientes: {
                create: ingredientes.map((ing) => ({
                  cantidad: ing.cantidad,
                  insumo: { connect: { id: ing.insumo_id } },
                  almacen: { connect: { id: ing.almacen_id } },
                })),
              },
            }
          : {}),
      },
      include: {
        ingredientes: true,
      },
    });
  }

  // 2. Listar platos paginados y filtrados
  async findAll(filters: FilterPlatoDto) {
    const { nombre, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (nombre) {
      where.nombre = { contains: nombre, mode: 'insensitive' };
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

  // 3. Obtener plato por ID con detalle de receta
  async findOne(id: number) {
    const plato = await this.prisma.platos_Menu.findUnique({
      where: { id },
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
                create: ingredientes.map((ing) => ({
                  cantidad: ing.cantidad,
                  insumo: { connect: { id: ing.insumo_id } },
                  almacen: { connect: { id: ing.almacen_id } },
                })),
              },
            }
          : {}),
      },
      include: {
        ingredientes: true,
      },
    });
  }

  // 5. Eliminar plato y sus ingredientes
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.ingredientes_Plato.deleteMany({
      where: { plato: { id } },
    });

    return this.prisma.platos_Menu.delete({
      where: { id },
    });
  }
}