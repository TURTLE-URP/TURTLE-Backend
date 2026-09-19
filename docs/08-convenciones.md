# 08 — Convenciones y troubleshooting

## Convenciones del código

### DTO valida lo que entra, Entity documenta lo que sale

* **`dto/`** — inputs (`@Body()`, `@Query()`): llevan validadores de `class-validator` y se chequean con el `ValidationPipe` global.
* **`entities/`** — outputs construidos en el servicio: llevan `@ApiProperty()` para Swagger, jamás validadores.

## Convenciones adoptadas (auth + trabajadores)

Reglas que rigen desde el módulo de trabajadores y se extienden a los siguientes:

* **Emails siempre en minúsculas para auth.** `@Transform(({ value }) => value?.trim().toLowerCase())` en los DTOs + `trim().toLowerCase()` defensivo en el service. El usuario puede escribir mayúsculas, el backend compara/guarda en minúsculas (evita duplicados `Mozo@` vs `mozo@` con el `@unique` case-sensitive de Postgres).
* **Entities con whitelist.** Toda entity de salida solo declara lo que sí sale, con `@Expose()`. Serialización siempre vía `toResponse()` / `toResponseMany()` / `toPaginatedResponse()` (`src/common/utils/serializer.util.ts`), que fuerzan `excludeExtraneousValues: true`. `password_hash` y campos internos ni se declaran: omitir = ocultar. `@Type(() => X)` es obligatorio en propiedades anidadas/arrays y en coerciones query-string → `number`/`boolean`.
* **Respuestas paginadas genéricas.** `PaginatedResponse(RecursoEntity, 'descripción')` (`src/common/entities/paginated-response.entity.ts`, factory mixin — no clase genérica directa, que rompería `@Type`/Swagger en runtime). Cada listado expone `XxxPaginatedResponse extends PaginatedResponse(...)`. No usar `toResponseMany` en flujos paginados (el `@Type` del wrapper ya mapea `data`); reservarlo para listas simples sin `meta` (catálogos, dropdowns).
* **Queries paginadas por extensión.** `FindXxxQueryDto extends PaginationQueryDto` (`page`/`limit` genéricos en `src/common/dto/`) + filtros propios (`search`, `role`, `activo`...). `@Type(() => Number)` convierte `?page="2"` a número antes de validar.
* **Actor auditor siempre requerido en endpoints.** `@CurrentUser()` / `@CurrentUserId()` (`src/auth/decorators/`) son estrictos: lanzan `401` si no hay user/`sub` válido. Nunca `@Req()` manual para el actor. `created_by/updated_by/deleted_by` se exigen en baja/actualización por endpoint (la columna `deleted_by` es nullable solo porque vale `NULL` en filas vivas).
* **Autorización a nivel de controller.** `@Roles('administrador', 'jefe')` + `@ApiBearerAuth()` en la clase (el `RolesGuard`/`JwtAuthGuard` ya son globales vía `APP_GUARD`). `@Roles` en método solo para excepciones (sobrescribe, no suma). Endpoints con bearer llevan `@ApiUnauthorizedResponse` + `@ApiForbiddenResponse`.
* **Baja lógica, nunca borrado físico.** `DELETE` = `deleted_at/updated_at = now()` + `deleted_by = actor del JWT` + `trabajador.activo = false`. `activo = false` es bloqueo temporal reversible (`PATCH /:id/activo`); `deleted_at != null` es baja definitiva. El login filtra `deleted_at: null` + `activo: true`.
* **Claves autogeneradas.** `POST /workers` no recibe password: el sistema genera 12 chars, guarda el hash y devuelve `plainPassword` una vez en `CreateWorkerResponse` (TODO: SES/correo y dejar de exponerlo en prod). `PATCH /:id` solo toca `name/lastName` (+ `updated_at` manual, el schema no usa `@updatedAt`); rol, email y password van por flujos dedicados.
* **Límites de módulos.** `UsersService` = identidad (búsquedas por `email`, `tipo_usuario`, `deleted_at`, creación con hash). `WorkersService` = gestión por `id` (CRUD, paginado, activar, baja). `AuthService` solo habla con `UsersService`, jamás Prisma directo. Los ids de Prisma son `Int` (nada de `BigInt` en fixtures/specs).
* **Códigos.** `201` crear (`@ApiCreatedResponse`), `200` leer/actualizar/borrar con body (`@ApiOkResponse`), `400` DTO, `409` duplicado, `404` inexistente/eliminado, `401` sin token/actor, `403` rol insuficiente.

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

### `23505 Usuario_pkey` al crear (secuencia desincronizada) — histórico

**Historia**: el historial pre-squash (detour bigint→int) dejó **dos secuencias** (`Usuario_id_seq` huérfana y `Usuario_id_seq1`, dueña real) y el seed insertaba ids explícitos sincronizando la equivocada vía `pg_get_serial_sequence`. Resuelto de raíz con baseline único + seed sin ids explícitos (ver convenciones arriba): hoy no hay `setval` que mantener.

Si el error reaparece (p. ej. inserts manuales con id literal por SQL), el diagnóstico y fix puntual siguen valiendo:

**Diagnóstico** (contra la BD que usa la API):

```sql
-- ¿cuál secuencia es la dueña real?
SELECT s.relname AS owned_seq FROM pg_attribute a
JOIN pg_class t ON t.oid = a.attrelid
JOIN pg_depend d ON d.refobjid = a.attrelid AND d.refobjsubid = a.attnum AND d.deptype = 'i'
JOIN pg_class s ON s.oid = d.objid
WHERE t.relname = 'Usuario' AND a.attname = 'id';
-- ¿está sincronizada? last_value debe ser >= MAX(id)
SELECT last_value FROM "Usuario_id_seq1";
SELECT MAX(id) FROM "Usuario";
```

**Fix puntual** (sin resembrar):

```sql
SELECT setval('"Usuario_id_seq1"', COALESCE((SELECT MAX(id) FROM "Usuario"), 1));
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

### `ERESOLVE` al instalar un paquete `@nestjs/*`

**Problema**: `npm install @nestjs/<paquete>` falla con `ERESOLVE unable to resolve dependency tree` y un `peer @nestjs/common@"^X"` distinto al Nest del proyecto. Pediste un major hecho para otro Nest (ej. swagger 12 pide Nest 12, el proyecto usa Nest 11).

**Solución**: instalar fijando el major compatible con `@nestjs/common` (ver [política de versiones](./02-stack.md)):

```bash
npm view @nestjs/swagger@11 peerDependencies  # confirmar peers
npm install --save @nestjs/swagger@^11
```

Nunca `--force` ni `--legacy-peer-deps`: tapan el conflicto e instalan una combinación que puede fallar en runtime.

---

[&larr; Anterior: API](./07-api.md) | [Siguiente: Integraciones DNI / RUC &rarr;](./09-integraciones-dni-ruc.md)