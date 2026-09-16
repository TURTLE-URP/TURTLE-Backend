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

**Solución**: liberar el puerto antes de relanzar:

```bash
# Ver qué usa el puerto 3000
lsof -i :3000

# Mata el proceso y relanza
kill <PID>
npm run start:dev
```

### Prisma no encuentra el schema o falta el cliente generado

```bash
npx prisma migrate dev   # Aplica migraciones pendientes
npx prisma generate      # Genera el cliente @prisma/client en node_modules
```

El cliente generado vive en `node_modules/@prisma/client`: se regenera con `npm install` (postinstall) o `npx prisma generate` y nunca se commitea.

### Error de conexión a PostgreSQL

```bash
# Verificar que postgres-db está healthy
docker compose ps

# La URL debe usar "localhost", no "postgres-db"
# ✅ correcto: postgresql://prisma_dev_user:prisma@localhost:5432/turtle
# ❌ incorrecto: postgresql://prisma_dev_user:prisma@postgres-db:5432/turtle

# Si cambiaste el puerto en DATABASE_PORT, refleja el cambio en DATABASE_URL
```

### `@nestjs/config` no encuentra `.env`

El `ConfigModule` lee desde la raíz del proyecto. Los comandos se corren desde la raíz:

```bash
# Asegúrate de que .env existe en la raíz del proyecto
ls .env
```

### `EACCES: permission denied` al compilar (`dist/` con dueño `root`)

**Problema**: `nest build` (con `deleteOutDir`) falla borrando `dist/` porque esa carpeta quedó con dueño `root` — típico tras correr `sudo npm run build` o un contenedor Docker como root sobre un volumen montado. El build **no** requiere sudo.

**Solución** (una sola vez):

```bash
sudo rm -rf dist
npm run build   # desde aquí dist/ vuelve a ser tuya, sin sudo
```

Para que no vuelva a pasar: trabaja siempre sin `sudo` y, si dockerizas el backend, no montes `./dist` como volumen (o fija `user: "${UID:-1000}:${GID:-1000}"` en el compose).

---

[&larr; Anterior: API](./07-api.md) | [Siguiente: Integraciones DNI / RUC &rarr;](./09-integraciones-dni-ruc.md)