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

  async remove(userId: number, deletedBy: number) {
    const existing = await this.prisma.usuario.findFirst({
      where: { id: userId, tipo_usuario: 'trabajador', deleted_at: null },
      include: { trabajador: true },
    });

    if (!existing?.trabajador) {
      throw new NotFoundException('Trabajador no encontrado.');
    }

    const now = new Date();
    await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        deleted_at: now,
        updated_at: now,
        deleted_by: deletedBy,
        trabajador: { update: { activo: false } },
      },
    });

    return { id: userId, message: `Trabajador #${userId} eliminado.` };
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
}
