import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma/prisma.service';
import { UsersService } from '@src/users/users.service';
import { WorkersService } from './workers.service';

describe('WorkersService', () => {
  let service: WorkersService;
  let prisma: {
    usuario: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
  };
  let users: {
    createUsuarioTrabajador: jest.Mock;
    remove: jest.Mock;
  };

  const usuarioDb = {
    id: 3,
    email: 'mozo@turtle.pe',
    tipo_usuario: 'trabajador',
    trabajador: {
      id: 3,
      nombre: 'Mozo',
      apellido: 'Test',
      password_hash: 'hashed',
      rol: 'mozo',
      activo: true,
    },
  };

  beforeEach(async () => {
    prisma = {
      usuario: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
    };
    users = {
      createUsuarioTrabajador: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: users },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create devuelve entity sin password_hash y con plainPassword', async () => {
    users.createUsuarioTrabajador.mockResolvedValue({
      user: usuarioDb,
      plainPassword: 'temporal123',
    });

    const result = await service.create({
      name: 'Mozo',
      lastName: 'Test',
      email: 'mozo@turtle.pe',
      role: 'mozo',
    } as never);

    expect(users.createUsuarioTrabajador).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: 3,
      email: 'mozo@turtle.pe',
      plainPassword: 'temporal123',
      trabajador: { nombre: 'Mozo', rol: 'mozo', activo: true },
    });
    expect(result as Record<string, unknown>).not.toHaveProperty(
      'password_hash',
    );
    expect(
      (result.trabajador as Record<string, unknown>).password_hash,
    ).toBeUndefined();
  });

  it('update actualiza nombre/apellido y marca updated_at', async () => {
    prisma.usuario.findFirst.mockResolvedValue(usuarioDb);
    prisma.usuario.update.mockResolvedValue({
      ...usuarioDb,
      trabajador: { ...usuarioDb.trabajador, nombre: 'Nuevo' },
    });

    const result = await service.update(3, { name: 'Nuevo' });

    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        updated_at: expect.any(Date),
        trabajador: { update: { nombre: 'Nuevo', apellido: undefined } },
      },
      include: { trabajador: true },
    });
    expect(result.trabajador.nombre).toBe('Nuevo');
  });

  it('update lanza 404 si no existe', async () => {
    prisma.usuario.findFirst.mockResolvedValue(null);

    await expect(service.update(99, { name: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.usuario.update).not.toHaveBeenCalled();
  });

  it('updateActivo cambia activo y devuelve entity', async () => {
    prisma.usuario.findFirst.mockResolvedValue(usuarioDb);
    prisma.usuario.update.mockResolvedValue({
      ...usuarioDb,
      trabajador: { ...usuarioDb.trabajador, activo: false },
    });

    const result = await service.updateActivo(3, { activo: false });

    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        updated_at: expect.any(Date),
        trabajador: { update: { activo: false } },
      },
      include: { trabajador: true },
    });
    expect(result.trabajador.activo).toBe(false);
  });

  it('updateActivo lanza 404 si no existe', async () => {
    prisma.usuario.findFirst.mockResolvedValue(null);

    await expect(
      service.updateActivo(99, { activo: false }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findOne devuelve entity y 404 si no existe', async () => {
    prisma.usuario.findFirst.mockResolvedValue(usuarioDb);

    const result = await service.findOne(3);

    expect(result).toMatchObject({
      id: 3,
      email: 'mozo@turtle.pe',
      trabajador: { nombre: 'Mozo' },
    });

    prisma.usuario.findFirst.mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findAll pagina con defaults y arma meta', async () => {
    prisma.usuario.count.mockResolvedValue(25);
    prisma.usuario.findMany.mockResolvedValue([usuarioDb]);

    const result = await service.findAll({});

    expect(prisma.usuario.count).toHaveBeenCalled();
    expect(prisma.usuario.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 10 }),
    );
    expect(result.meta).toEqual({
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
    });
    expect(result.data).toHaveLength(1);
  });

  it('findAll aplica filtros search/role/activo', async () => {
    prisma.usuario.count.mockResolvedValue(1);
    prisma.usuario.findMany.mockResolvedValue([usuarioDb]);

    await service.findAll({
      search: 'mozo',
      role: 'mozo',
      activo: true,
      page: 2,
      limit: 5,
    } as never);

    expect(prisma.usuario.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    );
    const where = prisma.usuario.findMany.mock.calls[0][0].where;
    expect(JSON.stringify(where)).toContain('mozo');
  });

  it('remove delega a UsersService con deletedBy', async () => {
    prisma.usuario.findFirst.mockResolvedValue(usuarioDb);
    users.remove.mockResolvedValue({ id: 3, message: 'ok' });

    await service.remove(3, 1);

    expect(users.remove).toHaveBeenCalledWith(3, 1);
  });

  it('remove lanza 404 si no es trabajador', async () => {
    prisma.usuario.findFirst.mockResolvedValue(null);

    await expect(service.remove(99, 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(users.remove).not.toHaveBeenCalled();
  });
});
