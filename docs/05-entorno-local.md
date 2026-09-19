# 05 — Entorno local

Docker se usa **solo para la base de datos**. El backend corre nativo en tu máquina (`npm run start:dev`): el type-check, el debugger, los tests y el cliente Prisma generado viven en el host.

> Si usas **Podman** en vez de Docker, sustituye `docker compose` por `podman compose` en todos los comandos de esta guía (el `compose.yaml` es compatible).

---

## Qué corre en Docker

```
├── compose.yaml    # Solo servicios de datos
```

| Servicio | Imagen | Puerto | Se levanta |
|---|---|---|---|
| `postgres-db` | `postgres:18-alpine` | `${DATABASE_PORT}:5432` | Siempre |
| `pgadmin` | `dpage/pgadmin4:9.14.0` | `${HOST_PGADMIN_PORT}:80` | Solo con `--profile dbClient` |

```bash
# Levantar la base de datos (en segundo plano)
docker compose up -d

# Con pgAdmin (solo para quien no tenga cliente de BD)
docker compose --profile dbClient up -d
```

### Persistencia

`postgres-db` guarda sus datos en el volumen nombrado `pg-data`, montado en `/var/lib/postgresql` (patrón recomendado para las imágenes de PostgreSQL 18).

Los scripts de `database/scripts/initialization/` (usuarios + permisos para `prisma_dev_user`) se ejecutan la primera vez que se crea la base de datos (vía `/docker-entrypoint-initdb.d`).

> ⚠️ Si cambias el puerto (`DATABASE_PORT`), asegúrate de que `DATABASE_URL` apunte a ese puerto con host `localhost`.

---

## Variables de entorno

`compose.yaml` interpola las variables desde tu `.env`. Las que usa Docker son:

| Variable | Default | Descripción |
|---|---|---|
| `DATABASE_DEFAULT_SUPERUSER` | `postgres` | PostgreSQL superuser |
| `DATABASE_SUPERUSER_PASSWORD` | *(auto-generated)* | Superuser password |
| `DATABASE_NAME` | `turtle` | Database name |
| `DATABASE_PORT` | `5432` | Host port for PostgreSQL |
| `HOST_PGADMIN_PORT` | `80` | pgAdmin web UI port |
| `PGADMIN_DEFAULT_EMAIL` | `admin@admin.com` | pgAdmin login email |
| `PGADMIN_DEFAULT_PASSWORD` | `admin_password` | pgAdmin login password |

Cámbiala en tu `.env` si tienes un PostgreSQL local ocupando `5432`.

---

## Comandos útiles

```bash
# Solo la BD
docker compose up -d

# Con pgAdmin
docker compose --profile dbClient up -d

# Logs de postgres
docker compose logs -f postgres-db

# Estado y salud
docker ps --filter name=postgres-db

# Bajar todo sin borrar datos
docker compose down

# Bajar todo + borrar la BD de desarrollo (re-ejecuta los scripts de init)
docker compose down -v
```

---

## Sin Docker: PostgreSQL local

Si prefieres no usar Docker, instala PostgreSQL 18 en tu máquina, crea la BD y ajusta `DATABASE_URL`:

```bash
createdb turtle
# En .env: postgresql://prisma_dev_user:prisma@localhost:5432/turtle
```

Los scripts de `database/scripts/initialization/` también se pueden aplicar manualmente con `psql` si quieres crear `prisma_dev_user` con los mismos permisos.

---

[&larr; Anterior: Base de datos](./04-base-de-datos.md) | [Siguiente: Desarrollo local &rarr;](./06-desarrollo.md)