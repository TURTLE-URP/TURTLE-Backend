# 05 — Docker

## ¿Qué problema resuelve?

Cada desarrollador tiene un SO distinto. Docker empaqueta **la misma versión de Node, PostgreSQL y las dependencias** para que todos corran exactamente lo mismo.

---

## Estructura de archivos

```
├── Dockerfile                       # 4 etapas (multi-stage)
├── docker-compose.yml               # Base: build del backend, volúmenes, networks, healthcheck
├── docker-compose.development.yml   # Desarrollo: watch/hot-reload, postgres, pgAdmin (perfil dbClient)
└── .dockerignore
```

> **Nota**: ya no existe `docker-compose.production.yml`. El `Dockerfile` tiene un stage de producción listo (`node dist/main.js`), pero el proyecto actualmente está pensado para desarrollo.

---

## Opción: Desarrollo

```bash
# Sin pgAdmin
docker compose \
  -f docker-compose.yml \
  -f docker-compose.development.yml \
  up --build --watch

# Con pgAdmin (perfil dbClient)
docker compose \
  -f docker-compose.yml \
  -f docker-compose.development.yml \
  --profile dbClient \
  up --build --watch
```

### Hot-reload

El flag `--watch` de Compose activa `develop.watch`:

| Cambio en | Acción |
|---|---|
| `./src/` | Sync automático al contenedor (ignora `src/generated/`) |
| `./prisma/` | Sync + reinicio del contenedor (para migraciones) |
| `package.json` | Rebuild de la imagen |

Dentro del contenedor, el entrypoint es `npm run start:dev` = `npx prisma generate && nest start --watch` (regenera el cliente Prisma y reinicia el servidor).

---

## Servicios

| Servicio | Imagen | Puerto | Healthcheck |
|---|---|---|---|
| `turtle-backend` | Personalizada | `${PORT}` | `GET /health` vía `healthcheck.js` c/15s |
| `postgres-db` | `postgres:18-alpine` | `${DATABASE_PORT}` | `pg_isready` c/10s |
| `pgadmin` | `dpage/pgadmin4:9.14.0` | `${HOST_PGADMIN_PORT}` | `/misc/ping` c/10s |

| Servicio | Cómo iniciarlo |
|---|---|
| `turtle-backend` | Siempre (junto con el override de desarrollo) |
| `postgres-db` | Siempre (dependencia de `turtle-backend`) |
| `pgadmin` | Solo con `--profile dbClient` |

---

## Dockerfile — 4 etapas

| Etapa | Propósito |
|---|---|
| `base` | `npm ci` + limpieza de caché |
| `development` | Copia la fuente; entrypoint `npm run start:dev` (`prisma generate` + `nest start --watch`) |
| `builder` | `prisma generate` + `npm run build` + `npm prune --production` |
| `production` | Solo `dist/` + `node_modules` desde builder; entrypoint `node dist/main.js` |

---

## Variables de entorno

El backend recibe `PORT` y `DATABASE_URL` desde el compose.

> ⚠️ **Pendiente**: las claves de integraciones (`CLOUDINARY_*`, `APIINTI_API_KEY`, `OPENRUC_BASE_URL`) **no se inyectan actualmente** al contenedor (el `.dockerignore` excluye `.env.*`). Para usarlas dentro de Docker hay que añadirlas al servicio `turtle-backend` (p. ej. `env_file: .env`).

---

## Comandos útiles

```bash
# Logs del backend
docker compose logs -f turtle-backend

# Shell dentro del contenedor
docker compose exec turtle-backend sh

# Aplicar migraciones desde dentro del contenedor
docker compose exec turtle-backend npx prisma migrate deploy

# Estado de salud
docker ps --filter name=turtle-backend

# Bajar todo + limpiar volúmenes
docker compose -f docker-compose.yml \
  -f docker-compose.development.yml \
  down -v
```

---

[&larr; Anterior: Base de datos](./04-base-de-datos.md) | [Siguiente: Desarrollo local &rarr;](./06-desarrollo.md)