import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import { CreateCustomerDto } from '@src/customers/dto/create-customer.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateWorkerDto } from '@src/workers/dto/create-worker.dto';
import { randomBytes } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createUsuarioTrabajador(dto: CreateWorkerDto) {
    // 1. Lógica de negocio: Validar si el email ya existe
    this.checkUserExists(dto.email);

    // 2. Preparando el objeto de entrada
    const data: Prisma.UsuarioCreateInput = {
      email: dto.email,
      tipo_usuario: 'trabajador',
      // Creamos el trabajador de forma anidada simultáneamente
      trabajador: {
        create: {
          nombre: dto.name,
          apellido: dto.lastName,
          password_hash: '',
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

    return user;
  }

  async createUsuarioClienteDigital(dto: CreateCustomerDto) {
    this.checkUserExists(dto.email);

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

  async remove(userId: number) {}

  private async checkUserExists(email: Usuario['email']) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
  }

  async findOne(email: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    return user;
  }

  private generateUserFirstPassword(length: number = 12) {
    return randomBytes(length).toString('base64').slice(0, length); // Asegura la longitud exacta
  }
}
