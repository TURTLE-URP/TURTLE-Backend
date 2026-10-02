import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { mesa_piso, pedido_tipo, Prisma, usuario_tipo } from '@prisma/client';
import { toPaginatedResponse, toResponse } from '@src/common/utils/serializer.util';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { DeactivateTableDto } from './dto/deactivate-table.dto';
import {
  EstadoRegistroMesa,
  FindTablesManagementQueryDto,
} from './dto/find-tables-management-query.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableManagementDto } from './dto/update-table-management.dto';
import { UpdateTableOcupadoDto } from './dto/update-table-ocupado.dto';
import {
  PaginatedTableManagementResponse,
  TableManagementItem,
} from './entities/table-management-response.entity';

const pedidoAbiertoInclude = {
  where: { deleted_at: null, tipo: 'local' as const },
  orderBy: { created_at: 'desc' as const },
  take: 1,
  include: {
    detalles: {
      include: { plato: true },
    },
  },
} satisfies Prisma.Mesa$pedidosArgs;

const mesaWithPedido = {
  pedidos: pedidoAbiertoInclude,
} satisfies Prisma.MesaInclude;

@Injectable()
export class TablesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async findByNumber(tableNumber: number) {
    const table = await this.prisma.mesa.findFirst({
      where: { numero_mesa: tableNumber, deleted_at: null },
      include: mesaWithPedido,
    });
    if (!table) {
      throw new NotFoundException(`Mesa #${tableNumber} no encontrada`);
    }
    return table;
  }

  async findAll() {
    return this.prisma.mesa.findMany({
      where: { deleted_at: null },
      include: mesaWithPedido,
      orderBy: { numero_mesa: 'asc' },
    });
  }

  async update(tableNumber: number, dto: UpdateTableDto, updatedBy?: number) {
    const table = await this.findByNumber(tableNumber);

    if (dto.numero != null && dto.numero !== table.numero_mesa) {
      const duplicate = await this.prisma.mesa.findFirst({
        where: {
          numero_mesa: dto.numero,
          deleted_at: null,
          id: { not: table.id },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `El Nro ${dto.numero} ya existe (${duplicate.codigo})`,
        );
      }
    }

    return this.prisma.mesa.update({
      where: { id: table.id },
      data: {
        ...(dto.numero != null ? { numero_mesa: dto.numero } : {}),
        ...(dto.capacidad != null ? { capacidad: dto.capacidad } : {}),
        ...(dto.piso != null ? { piso: dto.piso } : {}),
        ...(dto.ocupado != null ? { ocupado: dto.ocupado } : {}),
        updated_at: new Date(),
        ...(updatedBy != null ? { updated_by: updatedBy } : {}),
      },
      include: mesaWithPedido,
    });
  }

  async updateOcupado(
    tableNumber: number,
    dto: UpdateTableOcupadoDto,
    updatedBy?: number,
  ) {
    const table = await this.findByNumber(tableNumber);

    if (!dto.ocupado) {
      return this.prisma.mesa.update({
        where: { id: table.id },
        data: {
          ocupado: false,
          updated_at: new Date(),
          ...(updatedBy != null ? { updated_by: updatedBy } : {}),
        },
        include: mesaWithPedido,
      });
    }

    const comensales = dto.comensales ?? 0;
    if (comensales > table.capacidad) {
      throw new BadRequestException(
        `La cantidad de comensales supera la capacidad de la mesa (${table.capacidad})`,
      );
    }

    const documento = dto.documentoClienteLocal?.trim();
    const mozo = dto.mozo?.trim();

    return this.prisma.$transaction(async (tx) => {
      await tx.pedido.create({
        data: {
          codigo: `PED-${Date.now().toString(36).toUpperCase()}`,
          tipo: pedido_tipo.local,
          IGV: 0,
          subtotal: 0,
          id_mesa: table.id,
          nombre_cliente_local: dto.nombreClienteLocal,
          documento_cliente_local: documento ? documento : null,
          comensales,
          nombre_mozo: mozo ? mozo : null,
          ...(updatedBy != null ? { created_by: updatedBy } : {}),
        },
      });

      return tx.mesa.update({
        where: { id: table.id },
        data: {
          ocupado: true,
          updated_at: new Date(),
          ...(updatedBy != null ? { updated_by: updatedBy } : {}),
        },
        include: mesaWithPedido,
      });
    });
  }

  async findManagement(query: FindTablesManagementQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const estado = query.estado ?? EstadoRegistroMesa.activa;
    const search = query.search?.trim();
    const numero = search && /^\d+$/.test(search) ? Number(search) : undefined;

    const where: Prisma.MesaWhereInput = {
      deleted_at: estado === EstadoRegistroMesa.inactiva ? { not: null } : null,
      ...(query.piso ? { piso: query.piso } : {}),
      ...(search
        ? {
            OR: [
              { codigo: { contains: search, mode: 'insensitive' } },
              ...(numero != null ? [{ numero_mesa: numero }] : []),
            ],
          }
        : {}),
    };

    const [rows, total, activas, inactivas, piso1, piso2] = await Promise.all([
      this.prisma.mesa.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { numero_mesa: 'asc' },
      }),
      this.prisma.mesa.count({ where }),
      this.prisma.mesa.count({ where: { deleted_at: null } }),
      this.prisma.mesa.count({ where: { deleted_at: { not: null } } }),
      this.prisma.mesa.count({
        where: { deleted_at: null, piso: mesa_piso.piso_1 },
      }),
      this.prisma.mesa.count({
        where: { deleted_at: null, piso: mesa_piso.piso_2 },
      }),
    ]);

    const pageResult = toPaginatedResponse(
      PaginatedTableManagementResponse,
      rows.map((row) => this.toManagementItem(row)),
      total,
      page,
      limit,
    );

    return toResponse(PaginatedTableManagementResponse, {
      ...pageResult,
      summary: { activas, piso1, piso2, inactivas },
    });
  }

  async findManagementById(id: number) {
    const table = await this.prisma.mesa.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Mesa ${id} no encontrada`);
    }
    return this.toManagementItem(table);
  }

  async create(dto: CreateTableDto) {
    await this.assertNumeroDisponible(dto.numero);
    const actorId = await this.actorId();
    const created = await this.prisma.mesa.create({
      data: {
        codigo: this.codigoDe(dto.numero),
        numero_mesa: dto.numero,
        capacidad: dto.capacidad,
        piso: dto.piso,
        ocupado: false,
        created_by: actorId,
      },
    });
    return this.toManagementItem(created);
  }

  async updateManagement(id: number, dto: UpdateTableManagementDto) {
    const table = await this.findManagementById(id);
    if (dto.numero != null && dto.numero !== table.numero) {
      await this.assertNumeroDisponible(dto.numero, id);
    }
    const actorId = await this.actorId();
    const updated = await this.prisma.mesa.update({
      where: { id },
      data: {
        ...(dto.numero != null
          ? { numero_mesa: dto.numero, codigo: this.codigoDe(dto.numero) }
          : {}),
        ...(dto.capacidad != null ? { capacidad: dto.capacidad } : {}),
        ...(dto.piso != null ? { piso: dto.piso } : {}),
        updated_at: new Date(),
        updated_by: actorId,
      },
    });
    return this.toManagementItem(updated);
  }

  async deactivate(id: number, dto: DeactivateTableDto) {
    const table = await this.prisma.mesa.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Mesa ${id} no encontrada`);
    }
    if (table.deleted_at) {
      throw new BadRequestException('La mesa ya está inactiva');
    }
    if (table.ocupado) {
      throw new ConflictException(
        'No se puede dar de baja una mesa con un pedido abierto',
      );
    }
    const abierto = await this.prisma.pedido.findFirst({
      where: {
        id_mesa: table.id,
        deleted_at: null,
        tipo: pedido_tipo.local,
      },
      select: { id: true },
    });
    if (abierto) {
      throw new ConflictException(
        'No se puede dar de baja una mesa con un pedido abierto',
      );
    }

    const actorId = await this.actorId();
    const updated = await this.prisma.mesa.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: actorId,
        motivo_baja: dto.motivo,
        updated_at: new Date(),
        updated_by: actorId,
      },
    });
    return this.toManagementItem(updated);
  }

  async reactivate(id: number) {
    const table = await this.prisma.mesa.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Mesa ${id} no encontrada`);
    }
    if (!table.deleted_at) {
      throw new BadRequestException('La mesa ya está activa');
    }
    const actorId = await this.actorId();
    const updated = await this.prisma.mesa.update({
      where: { id },
      data: {
        deleted_at: null,
        deleted_by: null,
        motivo_baja: null,
        updated_at: new Date(),
        updated_by: actorId,
      },
    });
    return this.toManagementItem(updated);
  }

  private codigoDe(numero: number) {
    return `M-${String(numero).padStart(2, '0')}`;
  }

  private async assertNumeroDisponible(numero: number, exceptId?: number) {
    const codigo = this.codigoDe(numero);
    const duplicate = await this.prisma.mesa.findFirst({
      where: {
        ...(exceptId != null ? { id: { not: exceptId } } : {}),
        OR: [{ numero_mesa: numero }, { codigo }],
      },
    });
    if (duplicate) {
      throw new ConflictException(
        `El Nro ${numero} ya existe (${duplicate.codigo})`,
      );
    }
  }

  private async actorId() {
    const user = await this.prisma.usuario.findFirst({
      where: { tipo_usuario: usuario_tipo.trabajador },
      orderBy: { id: 'asc' },
      select: { id: true },
    });
    if (!user) {
      throw new BadRequestException(
        'No hay un trabajador para registrar la mesa',
      );
    }
    return user.id;
  }

  private toManagementItem(table: {
    id: number;
    codigo: string;
    numero_mesa: number;
    piso: mesa_piso;
    capacidad: number;
    ocupado: boolean;
    updated_at: Date | null;
    updated_by: number | null;
    deleted_at: Date | null;
    motivo_baja: string | null;
  }) {
    return toResponse(TableManagementItem, {
      id: table.id,
      codigo: table.codigo,
      numero: table.numero_mesa,
      piso: table.piso,
      capacidad: table.capacidad,
      ocupado: table.ocupado,
      updatedAt: table.updated_at,
      updatedBy: table.updated_by,
      estado: table.deleted_at ? 'inactiva' : 'activa',
      motivoBaja: table.motivo_baja,
    });
  }
}
