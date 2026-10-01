import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';

const API_KEY = 'test-api-key';

function httpContext(headers: Record<string, string> = {}): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  const config = { get: jest.fn() };
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new ApiKeyGuard(
    config as unknown as ConfigService,
    reflector as unknown as Reflector,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    config.get.mockImplementation((key: string) =>
      key === 'API_KEY' ? API_KEY : undefined,
    );
    reflector.getAllAndOverride.mockReturnValue(false);
  });

  it('deja pasar rutas con @SkipApiKey', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    expect(guard.canActivate(httpContext())).toBe(true);
    expect(config.get).not.toHaveBeenCalled();
  });

  it('rechaza si API_KEY no está configurada', () => {
    config.get.mockReturnValue('  ');
    expect(() => guard.canActivate(httpContext())).toThrow(
      UnauthorizedException,
    );
    expect(() => guard.canActivate(httpContext())).toThrow(
      'API key no configurada',
    );
  });

  it('rechaza sin header x-api-key', () => {
    expect(() => guard.canActivate(httpContext())).toThrow(
      'API key ausente o inválida',
    );
  });

  it('rechaza una key distinta', () => {
    expect(() =>
      guard.canActivate(httpContext({ 'x-api-key': 'otra-key' })),
    ).toThrow('API key ausente o inválida');
  });

  it('deja pasar cuando la key coincide', () => {
    expect(
      guard.canActivate(httpContext({ 'x-api-key': API_KEY })),
    ).toBe(true);
  });
});
