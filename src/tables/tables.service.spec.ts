import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mesa_piso, usuario_tipo } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { EstadoRegistroMesa } from './dto/find-tables-management-query.dto';
import { TablesService } from './tables.service';

describe('TablesService gestión', () => {
  let service: TablesService;
  let prisma: {
    mesa: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    pedido: { findFirst: jest.Mock };
    usuario: { findFirst: jest.Mock };
  };

  const mesaLibre = {
    id: 2,
    codigo: 'M-07',
    numero_mesa: 7,
    capacidad: 4,
    ocupado: false,
    piso: mesa_piso.piso_2,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    motivo_baja: null,
    created_by: 1,
  };

  beforeEach(async () => {
    prisma = {
      mesa: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      pedido: { findFirst: jest.fn() },
      usuario: { findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(TablesService);
  });

  it('lista activas por defecto y busca por número', async () => {
    prisma.mesa.findMany.mockResolvedValue([mesaLibre]);
    prisma.mesa.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(5);

    const result = await service.findManagement({
      search: '7',
      estado: EstadoRegistroMesa.activa,
      page: 1,
      limit: 4,
    });

    expect(prisma.mesa.findMany).toHaveBeenCalledWith({
      where: {
        deleted_at: null,
        OR: [
          { codigo: { contains: '7', mode: 'insensitive' } },
          { numero_mesa: 7 },
        ],
      },
      skip: 0,
      take: 4,
      orderBy: { numero_mesa: 'asc' },
    });
    expect(result.data[0]).toMatchObject({
      codigo: 'M-07',
      numero: 7,
      estado: 'activa',
    });
    expect(result.summary).toEqual({
      activas: 12,
      inactivas: 2,
      piso1: 7,
      piso2: 5,
    });
    expect(result.meta).toMatchObject({ total: 1, page: 1, limit: 4 });
  });

  it('rechaza crear una mesa cuyo número ya existe', async () => {
    prisma.mesa.findFirst.mockResolvedValue({
      id: 9,
      codigo: 'M-07',
      numero_mesa: 7,
    });

    await expect(
      service.create({
        numero: 7,
        capacidad: 4,
        piso: mesa_piso.piso_1,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.mesa.create).not.toHaveBeenCalled();
  });

  it('rechaza la baja si la mesa está ocupada', async () => {
    prisma.mesa.findUnique.mockResolvedValue({ ...mesaLibre, ocupado: true });

    await expect(
      service.deactivate(2, { motivo: 'Silla rota' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.pedido.findFirst).not.toHaveBeenCalled();
    expect(prisma.mesa.update).not.toHaveBeenCalled();
    expect(prisma.usuario.findFirst).not.toHaveBeenCalled();
  });

  it('consulta trabajadores al registrar el actor', async () => {
    prisma.mesa.findFirst.mockResolvedValue(null);
    prisma.usuario.findFirst.mockResolvedValue({ id: 1 });
    prisma.mesa.create.mockResolvedValue(mesaLibre);

    await service.create({
      numero: 7,
      capacidad: 4,
      piso: mesa_piso.piso_2,
    });

    expect(prisma.usuario.findFirst).toHaveBeenCalledWith({
      where: { tipo_usuario: usuario_tipo.trabajador },
      orderBy: { id: 'asc' },
      select: { id: true },
    });
  });
});
