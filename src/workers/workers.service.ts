import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UsersService } from '@src/users/users.service';
import { CreateWorkerResponse } from './entities/create-worker-response.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { WorkerResponseEntity } from './entities/worker-response.entity';
import { toResponse } from '@src/common/utils/serializer.util';
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

  //   async findAll() {
  //     return this.prisma.worker.findMany({
  //       select: workerSelect,
  //       orderBy: { worker_id: 'desc' },
  //     });
  //   }

  //   async findOne(id: number) {
  //     const worker = await this.prisma.worker.findUnique({
  //       where: { worker_id: id },
  //       select: workerSelect,
  //     });
  //     if (!worker) throw new NotFoundException(`Trabajador #${id} no encontrado`);
  //     return worker;
  //   }

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
    return this.usersService.remove(id, deletedBy);
  }
}
