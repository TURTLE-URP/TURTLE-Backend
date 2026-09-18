import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

type TestRequest = { headers: Record<string, string>; user?: unknown };

function httpContext(
  headers: Record<string, string> = {},
  user?: unknown,
): { ctx: ExecutionContext; req: TestRequest } {
  const req: TestRequest = { headers, user };
  const ctx = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
  return { ctx, req };
}

describe('JwtAuthGuard', () => {
  const jwt = { verifyAsync: jest.fn() };
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new JwtAuthGuard(
    jwt as never,
    reflector as unknown as Reflector,
  );

  beforeEach(() => jest.clearAllMocks());

  it('deja pasar rutas @Public sin token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    await expect(guard.canActivate(httpContext().ctx)).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza sin header Authorization', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    await expect(guard.canActivate(httpContext().ctx)).rejects.toThrow(
      'Token ausente',
    );
  });

  it('adjunta el payload y deja pasar con token válido', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwt.verifyAsync.mockResolvedValue({ sub: '3', rol: 'mozo' });
    const { ctx, req } = httpContext({ authorization: 'Bearer abc.def.ghi' });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.user).toEqual({ sub: '3', rol: 'mozo' });
  });

  it('rechaza token inválido', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwt.verifyAsync.mockRejectedValue(new Error('bad signature'));
    await expect(
      guard.canActivate(httpContext({ authorization: 'Bearer bad' }).ctx),
    ).rejects.toThrow('Token inválido o expirado');
  });
});

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflector as unknown as Reflector);

  beforeEach(() => jest.clearAllMocks());

  it('deja pasar sin metadata @Roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(httpContext({}, { rol: 'mozo' }).ctx)).toBe(true);
  });

  it('deja pasar con rol permitido', () => {
    reflector.getAllAndOverride.mockReturnValue(['mozo', 'jefe']);
    expect(guard.canActivate(httpContext({}, { rol: 'mozo' }).ctx)).toBe(true);
  });

  it('rechaza con rol insuficiente o sin usuario', () => {
    reflector.getAllAndOverride.mockReturnValue(['administrador']);
    expect(() =>
      guard.canActivate(httpContext({}, { rol: 'mozo' }).ctx),
    ).toThrow(ForbiddenException);
    expect(() => guard.canActivate(httpContext().ctx)).toThrow(
      ForbiddenException,
    );
  });
});
