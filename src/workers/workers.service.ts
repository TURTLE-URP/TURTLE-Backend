import { Inject, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UsersService } from '@src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { CreateWorkerResponse } from './entities/create-worker-response.entity';

@Injectable()
export class WorkersService {
  constructor(
    // @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateWorkerDto) {
    const workerUserWithPassword =
      await this.usersService.createUsuarioTrabajador(dto);

    return plainToInstance(CreateWorkerResponse, workerUserWithPassword, {
      excludeExtraneousValues: true,
    });
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

  async update(id: number, dto: UpdateWorkerDto) {}

  async remove(id: number) {
    return this.usersService.remove(id);
  }
}
