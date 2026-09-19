import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '@src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let users: { findWorker: jest.Mock };
  let jwt: { signAsync: jest.Mock };

  const worker = {
    id: 3,
    email: 'mozo@turtle.pe',
    tipo_usuario: 'trabajador',
    trabajador: {
      id: 3,
      nombre: 'Mozo',
      apellido: 'Test',
      activo: true,
      rol: 'mozo',
      password_hash: bcrypt.hashSync('secret123', 4),
    },
  };

  beforeEach(async () => {
    users = { findWorker: jest.fn() };
    jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('login devuelve token con sub string y rol', async () => {
    users.findWorker.mockResolvedValue(worker);

    const result = await service.login({
      email: 'mozo@turtle.pe',
      password: 'secret123',
    });

    expect(users.findWorker).toHaveBeenCalledWith('mozo@turtle.pe');
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
    users.findWorker.mockResolvedValue(worker);

    await expect(
      service.login({ email: 'mozo@turtle.pe', password: 'wrong-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('login rechaza trabajador inactivo o inexistente', async () => {
    users.findWorker.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'nadie@turtle.pe', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    users.findWorker.mockResolvedValueOnce({
      ...worker,
      trabajador: { ...worker.trabajador, activo: false },
    });
    await expect(
      service.login({ email: 'mozo@turtle.pe', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
