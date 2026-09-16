<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.icons8.com/fluency/96/turtle.png">
    <img src="https://img.icons8.com/color/96/turtle.png" width="120" alt="TURTLE Logo" />
  </picture>
</p>

<h1 align="center">🐢 TURTLE Backend</h1>

<p align="center">
  <em>Restaurant Inventory & Operations Management API</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" />
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Scripts](#-scripts)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

> 📚 Para una guía más detallada (en español), ver [docs/](docs/README.md).

---

## 🧩 About

**TURTLE** is a backend service designed for restaurant management — handling inventory, supplies, stock, warehouse locations, suppliers, menu items, and customer orders.

Built with **NestJS** and **Prisma** on **PostgreSQL**, the API provides a clean modular foundation that can scale from a single restaurant to a multi-branch operation.

The name **TURTLE** reflects the philosophy: *reliable, steady, and built to last*.

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| [NestJS](https://nestjs.com/) v11 | Application framework |
| [TypeScript](https://www.typescriptlang.org/) v5 | Language |
| [Prisma](https://www.prisma.io/) v7 | ORM, migrations & client |
| [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql) | Prisma driver adapter for `pg` |
| [PostgreSQL](https://www.postgresql.org/) 18 | Database |
| [Docker](https://www.docker.com/) / [Compose](https://docs.docker.com/compose/) | Local database only |
| [Jest](https://jestjs.io/) v30 | Testing framework |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      NestJS App                            │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │ConfigModule│ │PrismaModule│  │     HealthModule     │  │
│  │  (global)  │ │  (global)  │  │  (Terminus /health)  │  │
│  └─────┬──────┘  └─────┬─────┘  └──────────────────────┘  │
│        │               │                                   │
│  ┌─────┴───────────────┴───────────────────────────────┐  │
│  │                IntegrationsModule                    │  │
│  │  RucModule │ DniModule │ CloudinaryModule            │  │
│  │  /ruc/:n   │ /dni/:n   │ /media (upload · delete)    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────┘
                          │
┌─────────────────────────┴──────────────────────────────────┐
│                PostgreSQL (via Prisma Migrate)              │
└─────────────────────────────────────────────────────────────┘
```

- **ConfigModule**: variables de entorno (`.env`), global.
- **PrismaService**: cliente Prisma extendido con `@prisma/adapter-pg`, global.
- **HealthModule**: health checks de la API y la BD (`GET /health`).
- **IntegrationsModule**: consultas externas (RUC/DNI) y subida de media (Cloudinary).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `24.15.0` (ver `.nvmrc` y `engines` en `package.json`)
- **npm** ≥ 10
- **Docker** & **Docker Compose** (solo para PostgreSQL)

### 1. Clone & Install

```bash
git clone <repo-url>
cd TURTLE-Backend
npm install
```

### 2. Configure Environment

```bash
cp .env.template .env
```

### 3. Start the Database (Docker)

```bash
docker compose up -d
```

> PostgreSQL escucha en `${DATABASE_PORT}` (por defecto `5432`).  
> Opcionalmente, pgAdmin con: `docker compose --profile dbClient up -d`.

### 4. Apply Migrations

```bash
npx prisma migrate dev
```

### 5. Run the Server (natively, with hot-reload)

```bash
npm run start:dev
```

The API will be available at [http://localhost:3000](http://localhost:3000), health check at [http://localhost:3000/health](http://localhost:3000/health).

> Sin Docker: instala PostgreSQL 18 en tu máquina, crea la BD y apunta `DATABASE_URL` a ella. Detalles en [docs/05](./docs/05-entorno-local.md) y [docs/06](./docs/06-desarrollo.md).

---

## 🌱 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Application HTTP port |
| `DATABASE_URL` | `postgresql://prisma_dev_user:prisma@localhost:5432/turtle` | Prisma datasource URL |
| `DATABASE_DEFAULT_SUPERUSER` | `postgres` | PostgreSQL superuser |
| `DATABASE_SUPERUSER_PASSWORD` | *(auto-generated)* | Superuser password |
| `DATABASE_NAME` | `turtle` | Database name |
| `DATABASE_PORT` | `5432` | Host port for PostgreSQL |
| `HOST_PGADMIN_PORT` | `80` | pgAdmin web UI port (opcional, perfil `dbClient`) |
| `PGADMIN_DEFAULT_EMAIL` | `admin@admin.com` | pgAdmin login email |
| `PGADMIN_DEFAULT_PASSWORD` | `admin_password` | pgAdmin login password |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | `turtle` | Default upload folder |
| `OPENRUC_BASE_URL` | `https://openruc.com/api` | RUC provider base URL |
| `APIINTI_BASE_URL` | `https://app.apiinti.dev/api/v1` | DNI provider base URL |
| `APIINTI_API_KEY` | *(vacío)* | ApiInti bearer token |

---

## 📡 API Endpoints

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/` | Greeting / simple ping | ✅ |
| `GET` | `/health` | Health checks (API + database) | ✅ |
| `GET` | `/ruc/:numero` | RUC lookup via OpenRUC | ✅ |
| `GET` | `/dni/:numero` | DNI lookup via ApiInti | ✅ |
| `POST` | `/media/upload` | Upload an image to Cloudinary | ✅ |
| `DELETE` | `/media` | Delete an image by `publicId` | ✅ |

### Example: Health Check

```bash
curl http://localhost:3000/health
```

### Example: RUC Lookup

```bash
curl http://localhost:3000/ruc/20100047218
```

### Example: Upload Media

```bash
curl -X POST "http://localhost:3000/media/upload" -F "file=@./foto.png"
```

---

## 🗄️ Database Schema

The schema is defined in `prisma/schema.prisma` and migrations live in `prisma/migrations/`. It currently defines **33 models** and **14 enums**, grouped by domain:

| Domain | Models |
|---|---|
| Pedidos y mesas (5) | `Mesa`, `Pedido`, `Pago_Cliente`, `Detalles_Pedido`, `Detalles_Pago_Cliente` |
| Menú, comandas y cocina (5) | `Platos_Menu`, `Ingredientes_Plato`, `Comanda`, `Detalles_Comanda`, `Movimientos_Cocina` |
| Insumos, almacenes y stock (8) | `Insumo`, `Unidad_Medida`, `Insumo_Medidas`, `Almacen`, `Stock_Almacen`, `Movimiento_Almacen`, `Merma_Insumo`, `Evidencia_Merma` |
| Proveedores y abastecimiento (11) | `Proveedor`, `Proveedor_Contacto`, `Productos_Proveedor`, `Factura`, `Pagos_Factura`, `Orden_Abasto`, `Detalles_Orden_Abasto`, `Arribo_Abasto`, `Detalles_Arribo_Abasto`, `Distribucion_Abasto`, `Detalles_Distribucion_Abasto` |
| Usuarios y auditoría (4) | `Usuario`, `Trabajador`, `Cliente_Digital`, `Auditoria_Sistema` |

The Prisma client is generated from `prisma/schema.prisma` into `node_modules/@prisma/client` (default output, not committed). Detalles en [docs/04](./docs/04-base-de-datos.md).

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the app |
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Start production build (`node dist/main`) |
| `npm run build` | Compile the project |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format code with Prettier |

---

## 🧪 Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# with coverage
npm run test:cov
```

---

## 📁 Project Structure

```
TURTLE-Backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # GET /
│   ├── app.service.ts             # Root service
│   ├── health/                    # Health checks (Terminus)
│   ├── integrations/
│   │   ├── integrations.module.ts # Agrupa ruc + dni + cloudinary
│   │   ├── ruc/                   # OpenRUC lookup
│   │   ├── dni/                   # ApiInti lookup
│   │   └── cloudinary/            # Media upload / delete
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
├── prisma/
│   ├── schema.prisma              # Prisma schema (source of truth)
│   ├── seed.ts                    # Seed data (pendiente)
│   └── migrations/                # SQL migrations (versioned)
├── database/
│   └── scripts/
│       └── initialization/        # PostgreSQL init SQL (users + privileges)
├── compose.yaml                   # Solo PostgreSQL (+ pgAdmin opcional)
├── .env.template                  # Environment template
├── docs/                          # Guía detallada (01-10)
├── tsconfig.json
├── nest-cli.json
├── eslint.config.mjs
└── package.json
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request.

### Guidelines

- Follow the existing code style (Prettier + ESLint).
- Write tests for new functionality.
- Keep modules loosely coupled.
- Use the Prisma service for all database access.

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com/">NestJS</a>
</p>