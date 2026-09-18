import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '@src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { usuario: { findFirst: jest.Mock } };
  let jwt: { signAsync: jest.Mock };

  const worker = {
    id: BigInt(3),
    email: 'mozo@turtle.pe',
    trabajador: {
      id: BigInt(3),
      activo: true,
      rol: 'mozo',
      password_hash: bcrypt.hashSync('secret123', 4),
    },
  };

  beforeEach(async () => {
    prisma = { usuario: { findFirst: jest.fn() } };
    jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('login devuelve token con sub string y rol', async () => {
    prisma.usuario.findFirst.mockResolvedValue(worker);

    const result = await service.login({
      email: 'mozo@turtle.pe',
      password: 'secret123',
    });

    expect(result).toEqual({
      access_token: 'signed-token',
      token_type: 'bearer',
    });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: '3',
      email: 'mozo@turtle.pe',
      rol: 'mozo',
    });
  });

  it('login rechaza password incorrecto sin revelar el motivo', async () => {
    prisma.usuario.findFirst.mockResolvedValue(worker);

    await expect(
      service.login({ email: 'mozo@turtle.pe', password: 'wrong-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('login rechaza trabajador inactivo o inexistente', async () => {
    prisma.usuario.findFirst.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'nadie@turtle.pe', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    prisma.usuario.findFirst.mockResolvedValueOnce({
      ...worker,
      trabajador: { ...worker.trabajador, activo: false },
    });
    await expect(
      service.login({ email: 'mozo@turtle.pe', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('hashPassword genera hash verificable', async () => {
    const hash = await service.hashPassword('mi-clave');
    expect(hash).not.toBe('mi-clave');
    expect(await bcrypt.compare('mi-clave', hash)).toBe(true);
  });
});
