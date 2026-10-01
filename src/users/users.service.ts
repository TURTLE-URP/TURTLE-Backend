import {
  Injectable,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Usuario } from '@prisma/client';
import { CreateCustomerDto } from '@src/customers/dto/create-customer.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateWorkerDto } from '@src/workers/dto/create-worker.dto';
import { randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  async createUsuarioTrabajador(dto: CreateWorkerDto) {
    await this.checkUserExists(dto.email);
    const plainPassword = this.generateUserFirstPassword(12);
    const password_hash = await this.hashPassword(plainPassword);
    const data: Prisma.UsuarioCreateInput = {
      email: dto.email,
      tipo_usuario: 'trabajador',
      // Creamos el trabajador de forma anidada simultáneamente
      trabajador: {
        create: {
          nombre: dto.name,
          apellido: dto.lastName,
          password_hash: password_hash,
          activo: true,
          rol: dto.role,
        },
      },
    };

    // 3. Guardando el usuario en la BD
    const user = await this.prisma.usuario.create({
      data,
      include: { trabajador: true }, // Incluimos el trabajador en la respuesta
    });

    return { user, plainPassword };
  }

  async createUsuarioClienteDigital(dto: CreateCustomerDto) {
    await this.checkUserExists(dto.email);

    const data: Prisma.UsuarioCreateInput = {
      email: dto.email,
      tipo_usuario: 'cliente_digital',
      cliente: {
        create: {
          auth_provider: dto.auth_provider,
          nombre_completo: dto.nombre_completo,
          provider_user_id: dto.provider_user_id,
        },
      },
    };

    const user = await this.prisma.usuario.create({
      data,
      include: {
        cliente: true,
      },
    });

    return user;
  }

  async findOne(email: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    return user;
  }

  async findWorker(email: string) {
    return this.prisma.usuario.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        tipo_usuario: 'trabajador',
        deleted_at: null,
      },
      include: {
        trabajador: true,
      },
    });
  }

  async remove(userId: number, deletedBy: number | null) {
    const existing = await this.prisma.usuario.findFirst({
      where: { id: userId, deleted_at: null },
      include: { trabajador: true, cliente: true },
    });

    if (!existing || (!existing.trabajador && !existing.cliente)) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const now = new Date();
    await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        deleted_at: now,
        updated_at: now,
        deleted_by: deletedBy,
        ...(existing.trabajador
          ? { trabajador: { update: { activo: false } } }
          : {}),
      },
    });

    return { id: userId, message: `Usuario #${userId} eliminado.` };
  }

  private async checkUserExists(email: Usuario['email']) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado.');
    }
  }

  private generateUserFirstPassword(length: number = 12) {
    return randomBytes(length).toString('base64').slice(0, length); // Asegura la longitud exacta
  }

  private async hashPassword(plain: string): Promise<string> {
    const rounds = parseInt(this.config.get<string>('BCRYPT_ROUNDS', '10'), 10);
    return hash(plain, rounds);
  }

  async findAll(filters: FilterUsersDto) {
    const { page = 1, limit = 10, tipo, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.UsuarioWhereInput = {
      deleted_at: null,
      ...(tipo ? { tipo_usuario: tipo } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { trabajador: { nombre: { contains: search, mode: 'insensitive' } } },
              { trabajador: { apellido: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limit,
        include: {
          trabajador: {
            select: { id: true, nombre: true, apellido: true, rol: true, activo: true },
          },
          cliente: true,
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const user = await this.prisma.usuario.findFirst({
      where: { id, deleted_at: null },
      include: {
        trabajador: {
          select: { id: true, nombre: true, apellido: true, rol: true, activo: true },
        },
        cliente: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado.`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findById(id); // Valida existencia

    const { email, name, lastName, role, password } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1. Actualizar base en Usuario
      if (email) {
        await tx.usuario.update({
          where: { id },
          data: { email, updated_at: new Date() },
        });
      }

      // 2. Actualizar perfil Trabajador si aplica
      if (name || lastName || role || password) {
        const updateData: Record<string, any> = {};
        if (name) updateData.nombre = name;
        if (lastName) updateData.apellido = lastName;
        if (role) updateData.rol = role;
        if (password) updateData.password_hash = await this.hashPassword(password);

        await tx.trabajador.update({
          where: { id },
          data: updateData,
        });
      }

      return tx.usuario.findUnique({
        where: { id },
        include: { trabajador: true, cliente: true },
      });
    });
  }

  async toggleWorkerStatus(id: number) {
    const user = await this.findById(id);

    if (!user.trabajador) {
      throw new ConflictException('El usuario especificado no es un trabajador.');
    }

    const newStatus = !user.trabajador.activo;

    await this.prisma.trabajador.update({
      where: { id },
      data: { activo: newStatus },
    });

    return { id, activo: newStatus, message: `Estado del trabajador cambiado a: ${newStatus ? 'Activo' : 'Inactivo'}` };
  }

}
