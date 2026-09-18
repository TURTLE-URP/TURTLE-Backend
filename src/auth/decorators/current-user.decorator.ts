import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../auth.service';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): JwtPayload => {
    const user = ctx.switchToHttp().getRequest().user as JwtPayload | undefined;
    if (!user?.sub || !user?.email) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return user;
  },
);

export const CurrentUserId = createParamDecorator(
  (_, ctx: ExecutionContext): number => {
    const user = ctx.switchToHttp().getRequest().user as JwtPayload | undefined;
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    const sub = user.sub;
    const userid = Number(sub);
    return userid;
  },
);
