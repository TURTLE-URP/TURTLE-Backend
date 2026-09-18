import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UsersService } from '@src/users/users.service';

const workerSelect = {
  worker_id: true,
  name: true,
  last_name: true,
  role: true,
  created_at: true,
  updated_at: true,
} as const;

@Injectable()
export class WorkersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateWorkerDto) {
    const {user, plainPassword} = await this.usersService.createUsuarioTrabajador(dto);
    
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

  async update(id: number, dto: UpdateWorkerDto) {
    // await this.findOne(id);
    // const data: Prisma.workerUpdateInput = {};
    // if (dto.name !== undefined) data.name = dto.name;
    // if (dto.lastName !== undefined) data.last_name = dto.lastName;
    // if (dto.role !== undefined) data.role = dto.role;
    // if (dto.password !== undefined) {
    //   data.password_hash = await bcrypt.hash(dto.password, 10);
    // }
    // return this.prisma.worker.update({
    //   where: { worker_id: id },
    //   data,
    //   select: workerSelect,
    // });
  }

  async remove(id: number) {
    return this.usersService.remove(id);
  }
}
