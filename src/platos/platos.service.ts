import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { platos_categoria } from '@prisma/client';

@Injectable()
export class PlatosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlatoDto: CreatePlatoDto, userId: number | string) {
    return this.prisma.platos_Menu.create({
      data: {
        ...createPlatoDto,
        created_by: Number(userId), // Convierte "3" a 3
      },
    });
  }

  async findAll(categoria?: platos_categoria) {
    return this.prisma.platos_Menu.findMany({
      where: {
        deleted_at: null,
        ...(categoria && { categoria }),
      },
    });
  }

  async findOne(id: number) {
    const plato = await this.prisma.platos_Menu.findFirst({
      where: { id, deleted_at: null },
    });

    if (!plato) {
      throw new NotFoundException(`El platillo con ID ${id} no fue encontrado`);
    }

    return plato;
  }

  async update(id: number, updatePlatoDto: UpdatePlatoDto, userId: number | string) {
    await this.findOne(id);

    return this.prisma.platos_Menu.update({
      where: { id },
      data: {
        ...updatePlatoDto,
        updated_at: new Date(),
        updated_by: Number(userId), // Convierte a entero
      },
    });
  }

  async remove(id: number, userId: number | string) {
    await this.findOne(id);

    return this.prisma.platos_Menu.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: Number(userId), // Convierte a entero
      },
    });
  }
}