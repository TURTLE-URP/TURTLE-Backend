# 06 — Desarrollo local

El backend corre **nativo** en tu máquina. Docker solo aporta la base de datos (ver [05 — Entorno local](./05-entorno-local.md)).

## Setup inicial

```bash
nvm use                  # Node 24.15.0
npm install              # Instala dependencias y genera el cliente Prisma (postinstall)

# Levantar la base de datos
docker compose up -d

# Copiar y ajustar variables de entorno (ver 05 — Entorno local)
cp .env.template .env

# Migraciones y cliente (en v7 van por separado)
npx prisma migrate dev
npx prisma generate
npm run db:seed          # datos demo (idempotente)
```

> Desde este momento todo (compilar, tests, debugger, IDE) corre en tu host.

---

## Flujo diario

```bash
# 1. Levantar la BD (si no está arriba)
docker compose up -d

# 2. Iniciar el backend con hot-reload
npm run start:dev

# 3. Editar código en ./src/
#    → nest start --watch recompila y reinicia

# 4. Verificar
curl http://localhost:3000/
curl http://localhost:3000/health

# 5. Tests
npm run test
```

---

## Comandos del proyecto

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Hot-reload: `nest start --watch` |
| `npm run build` | Compila a `dist/` (el `prebuild` regenera el cliente Prisma antes) |
| `npm run start:prod` | Corre la versión compilada |
| `npm run lint` | ESLint con autocorrección |
| `npm run format` | Prettier |
| `npm run test` | Tests unitarios (Jest) |
| `npm run test:cov` | Tests con cobertura |
| `npm run test:e2e` | Tests end-to-end |

---

## Cambios en la base de datos

```bash
# 1. Editar prisma/schema.prisma

# 2. Crear y aplicar la migración
npx prisma migrate dev --name "descripcion_del_cambio"

# 3. Commitear schema + migración
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): describir el cambio"
```

> El cliente `@prisma/client` se genera con `npm install` (postinstall), `npm run build` (prebuild) o `npx prisma generate` explícito. En Prisma v7, `migrate dev` **no** regenera el cliente ni corre el seed: van por separado.

> Los scripts de `database/scripts/initialization/` solo se ejecutan al crear el volumen por primera vez. Si cambias usuarios/permisos, borra el volumen con `down -v` para re-ejecutarlos.

---

## Instalar dependencias nuevas

```bash
npm install algun-paquete
# Commitear package.json + package-lock.json
```

---

## Tests

```bash
npm run test        # Unitarios
npm run test:cov    # Con cobertura
npm run test:e2e    # End-to-end
```

---

[&larr; Anterior: Entorno local](./05-entorno-local.md) | [Siguiente: API &rarr;](./07-api.md)