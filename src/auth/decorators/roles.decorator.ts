import { SetMetadata } from '@nestjs/common';
import { trabajador_rol } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: trabajador_rol[]) =>
  SetMetadata(ROLES_KEY, roles);
