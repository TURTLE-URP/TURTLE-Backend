import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createHash, timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { SKIP_API_KEY } from '../decorators/skip-api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return true;
    }

    const expected = this.config.get<string>('API_KEY')?.trim();
    if (!expected) {
      throw new UnauthorizedException('API key no configurada');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers['x-api-key'];
    const provided = (Array.isArray(header) ? header[0] : header)?.trim();
    if (!provided || !this.keysMatch(provided, expected)) {
      throw new UnauthorizedException('API key ausente o inválida');
    }

    return true;
  }

  private keysMatch(provided: string, expected: string): boolean {
    const providedHash = createHash('sha256').update(provided).digest();
    const expectedHash = createHash('sha256').update(expected).digest();
    return timingSafeEqual(providedHash, expectedHash);
  }
}
