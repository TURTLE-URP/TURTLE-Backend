# 08 — Convenciones y troubleshooting

## Convenciones del código

### Sin comentarios

El código fuente no lleva comentarios. La documentación vive en `docs/`.

### `@Inject()` explícito en constructores

Usamos `tsx watch` para desarrollo (hot-reload confiable). `tsx` usa **esbuild**, que **no soporta `emitDecoratorMetadata`**.

Esto significa que la inyección automática por tipo **no funciona**. Debes usar `@Inject()` explícito:

```typescript
// ✅ Correcto
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MiServicio {
  constructor(
    @Inject(OtroServicio) private readonly otro: OtroServicio,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}
}
```

```typescript
// ❌ Incorrecto — no funciona con tsx
constructor(
  private readonly otro: OtroServicio,
) {}
```

### `reflect-metadata` en main.ts

```typescript
// main.ts — primera línea
import 'reflect-metadata';
```

### Module format: `nodenext`

El `tsconfig.json` usa `module: "nodenext"`. Esto permite mezclar ESM y CJS según `type` en `package.json`.

### Path alias: `@src/*`

```typescript
import { PrismaService } from '@src/prisma/prisma.service';
// Equivalente a: import from './prisma/prisma.service'
```

---

## Troubleshooting

### EADDRINUSE al reiniciar

**Problema**: `nest start --watch` no mata el proceso anterior y el puerto queda ocupado.

**Solución**: Usar `tsx watch` en lugar de `nest start --watch`. El `Dockerfile` ya usa `tsx watch` en la etapa `development`.

### Hot-reload no funciona en slim

**Problema**: La imagen `node:slim` no tiene los binarios necesarios para el file watcher.

**Solución**: Usar la imagen `node:${version}` completa (no slim). El Dockerfile ya usa `node:24.15.0`.

### Prisma no encuentra el schema

```bash
npx prisma db pull   # Sincroniza schema de BD → schema.prisma
npx prisma generate  # Genera el cliente TypeScript
```

### Error de conexión a PostgreSQL

```bash
# Verificar que postgres está healthy
docker compose ps

# Verificar DATABASE_URL
docker compose exec turtle-backend printenv DATABASE_URL

# La URL debe usar "postgres-db" como host, no "localhost"
# ✅ correcto: postgresql://user:pass@postgres-db:5432/turtledb
# ❌ incorrecto: postgresql://user:pass@localhost:5432/turtledb
```

### `@nestjs/config` no encuentra `.env`

El `ConfigModule` lee desde la raíz del proyecto. Si corres comandos desde otra carpeta, especifica la ruta:

```bash
# En el docker-compose, el working directory es /usr/src/app
# Asegúrate de que .env existe en la raíz del proyecto
```

---

[&larr; Anterior: API](./07-api.md) | [Siguiente: Integraciones DNI / RUC &rarr;](./09-integraciones-dni-ruc.md)
