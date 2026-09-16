# 05 — Docker

## ¿Qué problema resuelve?

Cada desarrollador tiene un SO distinto. Docker empaqueta **la misma versión de Node, PostgreSQL y las dependencias** para que todos corran exactamente lo mismo.

---

## Estructura de archivos

```
├── Dockerfile      # 4 etapas (multi-stage)
├── compose.yaml    # Backend + PostgreSQL (único archivo)
└── .dockerignore
```

Un solo comando levanta todo:

```bash
docker compose up --build --watch
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
| `backend` | Personalizada (`target: development`) | `${PORT}` | `GET /health` vía `healthcheck.js` c/15s |
| `postgres-db` | `postgres:18-alpine` | `${DATABASE_PORT}` | `pg_isready` c/10s |

El backend depende de que PostgreSQL esté `healthy` antes de arrancar.

---

## Persistencia

`postgres-db` guarda sus datos en el volumen nombrado `pg-data`, montado en `/var/lib/postgresql` (patrón recomendado para las imágenes de PostgreSQL 18, cuyo PGDATA vive en `/var/lib/postgresql/18/docker`).

Los scripts de `database/scripts/initialization/` se ejecutan la primera vez que se crea la base de datos (vía `/docker-entrypoint-initdb.d`).

> ⚠️ Si vienes de la configuración anterior (volumen montado en `/var/lib/postgresql/18/docker`), el cambio de ruta exige recrear el volumen: `docker compose down -v`. La BD de desarrollo se regenera con los scripts de init y las migraciones.

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

El servicio `backend` carga `.env` vía `env_file`, por eso **todas** las variables (`PORT`, `DATABASE_URL`, `CLOUDINARY_*`, `APIINTI_*`, `OPENRUC_BASE_URL`…) están disponibles dentro del contenedor.

---

## Comandos útiles

```bash
# Levantar (watch + hot-reload)
docker compose up --build --watch

# Logs del backend
docker compose logs -f backend

# Shell dentro del contenedor
docker compose exec backend sh

# Aplicar migraciones desde dentro del contenedor
docker compose exec backend npx prisma migrate deploy

# Estado de salud
docker ps --filter name=backend

# Bajar todo + limpiar volúmenes (borra la BD de desarrollo)
docker compose down -v
```

---

[&larr; Anterior: Base de datos](./04-base-de-datos.md) | [Siguiente: Desarrollo local &rarr;](./06-desarrollo.md)