# 08 — Convenciones y troubleshooting

## Convenciones del código

### Sin comentarios

El código fuente no lleva comentarios. La documentación vive en `docs/`.

### `@Inject()` explícito en constructores

Convención del proyecto: declarar las dependencias con `@Inject(...)` en el constructor.

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

No es estrictamente obligatorio: `tsc` emite `emitDecoratorMetadata` y Nest resuelve la inyección por tipo de forma automática. Se usa `@Inject()` para hacer la inyección **explícita** y a prueba de herramientas que no emiten metadatos (esbuild/`tsx`, algunos runners de tests).

### `reflect-metadata`

`@nestjs/core` carga `reflect-metadata` en tiempo de ejecución. Si usas herramientas que lo requieren explícitamente (tests, `ts-node`), agrégalo como primera línea:

```typescript
// main.ts — primera línea (cuando sea necesario)
import 'reflect-metadata';
```

### Module format: `nodenext`

El `tsconfig.json` usa `module: "nodenext"`. Esto permite mezclar ESM y CJS según `type` en `package.json`.

### Path alias: `@src/*`

```typescript
import { PrismaService } from '@src/prisma/prisma.service';
// Equivalente a: import from './prisma/prisma.service'
```

`tsc` resuelve el alias a la ruta relativa correspondiente al compilar, así que también funciona en producción.

---

## Troubleshooting

### EADDRINUSE al reiniciar

**Problema**: el proceso anterior no se mató y el puerto queda ocupado.

**Solución**: reiniciar el servicio del contenedor:

```bash
docker compose restart turtle-backend
```

Si corres en el host, mata el proceso que ocupa el puerto antes de relanzar.

### Hot-reload no funciona en slim

**Problema**: las imágenes `node:slim` no tienen los binarios necesarios para el file watcher.

**Solución**: usar la imagen `node:${version}` completa (no slim). El Dockerfile ya usa `node:24.15.0`.

### Prisma no encuentra el schema o falta el cliente generado

```bash
npx prisma migrate dev   # Aplica migraciones pendientes
npx prisma generate      # Genera el cliente TypeScript en src/generated/prisma
```

El directorio `src/generated/prisma` está en `.gitignore`: se regenera y nunca se commitеa.

### Error de conexión a PostgreSQL

```bash
# Verificar que postgres está healthy
docker compose ps

# Verificar DATABASE_URL
docker compose exec turtle-backend printenv DATABASE_URL

# Dentro de Docker la URL debe usar "postgres-db" como host, no "localhost"
# ✅ correcto:   postgresql://prisma_dev_user:prisma@postgres-db:5432/turtle
# ❌ incorrecto: postgresql://prisma_dev_user:prisma@localhost:5432/turtle

# Fuera de Docker, usa "localhost"
# ✅ local:      postgresql://prisma_dev_user:prisma@localhost:5432/turtle
```

### `@nestjs/config` no encuentra `.env`

El `ConfigModule` lee desde la raíz del proyecto. Si corres comandos desde otra carpeta, especifica la ruta:

```bash
# En el docker-compose, el working directory es /usr/src/app
# Asegúrate de que .env existe en la raíz del proyecto
```

---

[&larr; Anterior: API](./07-api.md) | [Siguiente: Integraciones DNI / RUC &rarr;](./09-integraciones-dni-ruc.md)