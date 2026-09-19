import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { FindWorkersQueryDto } from './dto/find-workers-query.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UsersService } from '@src/users/users.service';
import { CreateWorkerResponse } from './entities/create-worker-response.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { PaginatedWorkersResponse } from './entities/paginated-workers-response.entity';
import { WorkerResponseEntity } from './entities/worker-response.entity';
import {
  toPaginatedResponse,
  toResponse,
} from '@src/common/utils/serializer.util';
import { UpdateActivoDto } from './dto/update-activo.dto';

@Injectable()
export class WorkersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateWorkerDto): Promise<CreateWorkerResponse> {
    const { user, plainPassword } =
      await this.usersService.createUsuarioTrabajador(dto);

    return toResponse(CreateWorkerResponse, { ...user, plainPassword });
  }

  async findAll(query: FindWorkersQueryDto): Promise<PaginatedWorkersResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const and: Prisma.UsuarioWhereInput[] = [
      { tipo_usuario: 'trabajador', deleted_at: null },
    ];

    if (query.search) {
      and.push({
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          {
            trabajador: {
              is: {
                OR: [
                  { nombre: { contains: query.search, mode: 'insensitive' } },
                  { apellido: { contains: query.search, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      });
    }

    if (query.role) {
      and.push({ trabajador: { is: { rol: query.role } } });
    }

    if (query.activo !== undefined) {
      and.push({ trabajador: { is: { activo: query.activo } } });
    }

    const where: Prisma.UsuarioWhereInput = { AND: and };

    const [total, items] = await Promise.all([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        where,
        include: { trabajador: true },
        orderBy: { id: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return toPaginatedResponse(
      PaginatedWorkersResponse,
      items,
      total,
      page,
      limit,
    );
  }

  async findOne(id: number): Promise<WorkerResponseEntity> {
    const worker = await this.prisma.usuario.findFirst({
      where: { id, tipo_usuario: 'trabajador', deleted_at: null },
      include: { trabajador: true },
    });

    if (!worker?.trabajador) {
      throw new NotFoundException('Trabajador no encontrado.');
    }

    return toResponse(WorkerResponseEntity, worker);
  }

  async update(
    id: number,
    dto: UpdateWorkerDto,
  ): Promise<WorkerResponseEntity> {
    const worker = await this.prisma.usuario.findFirst({
      where: { id, tipo_usuario: 'trabajador', deleted_at: null },
      include: { trabajador: true },
    });

    if (!worker) {
      throw new NotFoundException('Trabajador no encontrado.');
    }

    const updatedWorker = await this.prisma.usuario.update({
      where: { id },
      data: {
        updated_at: new Date(),
        trabajador: { update: { nombre: dto.name, apellido: dto.lastName } },
      },
      include: { trabajador: true },
    });

    return toResponse(WorkerResponseEntity, updatedWorker);
  }

  async updateActivo(id: number, dto: UpdateActivoDto) {
    const worker = await this.prisma.usuario.findFirst({
      where: { id, tipo_usuario: 'trabajador', deleted_at: null },
      include: { trabajador: true },
    });

    if (!worker) throw new NotFoundException(`Trabajador no encontrado.`);

    const actualizado = await this.prisma.usuario.update({
      where: { id },
      data: {
        updated_at: new Date(),
        trabajador: { update: { activo: dto.activo } },
      },
      include: { trabajador: true },
    });
    return toResponse(WorkerResponseEntity, actualizado);
  }

  async remove(id: number, deletedBy: number) {
    const worker = await this.prisma.usuario.findFirst({
      where: { id, tipo_usuario: 'trabajador', deleted_at: null },
      include: { trabajador: true },
    });

    if (!worker?.trabajador) {
      throw new NotFoundException('Trabajador no encontrado.');
    }

    return this.usersService.remove(id, deletedBy);
  }
}
