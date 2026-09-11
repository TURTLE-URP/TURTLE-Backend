import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing && !existing.deleted_at)
      throw new ConflictException(`El email ${dto.email} ya está registrado`);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        user_type: dto.userType,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deleted_at: null },
      orderBy: { user_id: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { user_id: id, deleted_at: null },
    });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { user_id: id },
      data: {
        email: dto.email,
        user_type: dto.userType,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { user_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
