# 06 — Desarrollo local

## Setup inicial

```bash
nvm use                  # Node 24.15.0
npm install              # Instalar dependencias
npx prisma generate      # Generar cliente Prisma
```

> Dentro del contenedor de Docker el `prisma generate` se ejecuta automáticamente en cada arranque (ver `npm run start:dev`).

---

## Elige tu opción

```mermaid
flowchart LR
    A["¿Cómo quieres\ntrabajar?"] --> B["Con Docker\n(recomendado)"]
    A --> C["Sin Docker\n(solo backend)"]
    B --> D["docker compose development\nup --build --watch"]
    C --> E["Necesitas PostgreSQL\ncorriendo aparte"]
    E --> F["npm run start:dev"]

    style A fill:#30363d,stroke:#8b949e,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#9e6a03,stroke:#d29922,color:#fff
    style D fill:#238636,stroke:#3fb950,color:#fff
    style F fill:#238636,stroke:#3fb950,color:#fff
```

---

## Comandos del proyecto

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Hot-reload: `prisma generate` + `nest start --watch` |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Corre la versión compilada |
| `npm run lint` | ESLint con autocorrección |
| `npm run format` | Prettier |
| `npm run test` | Tests unitarios (Jest) |
| `npm run test:cov` | Tests con cobertura |
| `npm run test:e2e` | Tests end-to-end |

---

## Flujo diario con Docker

```bash
# 1. Levantar servicios
docker compose -f docker-compose.yml \
  -f docker-compose.development.yml \
  up --build --watch

# 2. Aplicar migraciones (la primera vez)
docker compose exec turtle-backend npx prisma migrate deploy

# 3. Editar código en ./src/
#    → Docker sync copia los cambios al contenedor
#    → nest start --watch reinicia el servidor

# 4. Verificar
curl http://localhost:3000/
curl http://localhost:3000/health

# 5. Tests dentro del contenedor
docker compose exec turtle-backend npm run test
```

---

## Desarrollo sin Docker

```bash
# 1. Levantar solo la base de datos
docker compose -f docker-compose.yml \
  -f docker-compose.development.yml \
  up -d postgres-db

# 2. Apuntar DATABASE_URL al host local
#    En .env: postgresql://prisma_dev_user:prisma@localhost:5432/turtle

# 3. Migraciones y cliente
npx prisma migrate dev
npx prisma generate

# 4. Iniciar el backend
npm run start:dev
```

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

> Los scripts de `database/scripts/initialization/` solo se ejecutan al crear el volumen por primera vez. Si cambias usuarios/permisos, borra el volumen con `down -v` para re-ejecutarlos.

---

## Instalar dependencias nuevas

```bash
npm install algun-paquete
# Docker detecta el cambio en package.json
# → rebuild automático
```

---

## Tests

```bash
npm run test        # Unitarios
npm run test:cov    # Con cobertura
npm run test:e2e    # End-to-end

# En Docker:
docker compose exec turtle-backend npm run test
```

---

[&larr; Anterior: Docker](./05-docker.md) | [Siguiente: API &rarr;](./07-api.md)