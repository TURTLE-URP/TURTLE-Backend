import { ClassConstructor, plainToInstance } from 'class-transformer';

export function toResponse<T, V>(cls: ClassConstructor<T>, plain: V): T {
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}

export function toResponseMany<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
): T[] {
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}

export function toPaginatedResponse<T, V>(
  cls: ClassConstructor<T>,
  items: V[],
  total: number,
  page: number,
  limit: number,
): T {
  return toResponse(cls, {
    data: items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
