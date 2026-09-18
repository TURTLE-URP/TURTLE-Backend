import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
// import { Prisma, audit_action_type } from '@src/generated/prisma/client';
import { CreateAuditDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /*
  async create(dto: CreateAuditDto) {
    const user = await this.prisma.user.findFirst({
      where: { user_id: dto.userId, deleted_at: null },
    });
    if (!user)
      throw new NotFoundException(`Usuario #${dto.userId} no encontrado`);

    return this.prisma.system_audit.create({
      data: {
        user_id: dto.userId,
        action: dto.action,
        affected_table: dto.affectedTable,
        row_id: dto.rowId,
        ip_address: dto.ipAddress,
        user_agent: dto.userAgent,
      },
      include: {
        user: { select: { user_id: true, email: true } },
      },
    });
  }

  async findAll(filters: {
    action?: audit_action_type;
    affectedTable?: string;
    userId?: number;
  }) {
    const where: Prisma.system_auditWhereInput = {};
    if (filters.action) where.action = filters.action;
    if (filters.affectedTable)
      where.affected_table = { contains: filters.affectedTable };
    if (filters.userId) where.user_id = filters.userId;

    return this.prisma.system_audit.findMany({
      where,
      include: {
        user: { select: { user_id: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findOne(id: number) {
    const audit = await this.prisma.system_audit.findUnique({
      where: { system_audit_id: id },
      include: {
        user: { select: { user_id: true, email: true } },
      },
    });
    if (!audit) throw new NotFoundException(`Auditoría #${id} no encontrada`);
    return audit;
  }

  async findByUser(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { user_id: userId, deleted_at: null },
    });
    if (!user) throw new NotFoundException(`Usuario #${userId} no encontrado`);

    return this.prisma.system_audit.findMany({
      where: { user_id: userId },
      include: {
        user: { select: { user_id: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
    });
  }
  */
}
