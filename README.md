<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.icons8.com/fluency/96/turtle.png">
    <img src="https://img.icons8.com/color/96/turtle.png" width="120" alt="TURTLE Logo" />
  </picture>
</p>

<h1 align="center">🐢 TURTLE Backend</h1>

<p align="center">
  <em>API de gestión para restaurantes: inventario, proveedores, menú y pedidos.</em>
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

## 📋 Contenido

- [Acerca de](#-acerca-de)
- [Inicio rápido](#-inicio-rápido)
- [Scripts](#-scripts)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)

---

## 🧩 Acerca de

**TURTLE** es el backend del sistema de gestión para restaurantes: centraliza inventario de insumos, proveedores, menú y pedidos en una API REST construida con **NestJS 11 + Prisma 7 + PostgreSQL 18**.

> 📚 La guía detallada (stack, arquitectura, BD, entorno, API, convenciones) vive en [docs/](docs/README.md).

---

## 🚀 Inicio rápido

### Requisitos

- **Node.js** `24.15.0` (`nvm use`)
- **npm** ≥ 10
- **Docker** + **Docker Compose** (solo para PostgreSQL)

### Pasos

```bash
# 1. Clonar e instalar (el postinstall genera el cliente Prisma)
git clone <repo-url>
cd TURTLE-Backend
nvm use
npm install

# 2. Configurar entorno
cp .env.template .env

# 3. Levantar la base de datos
docker compose up -d

# 4. Aplicar migraciones
npx prisma migrate dev

# 5. Correr el servidor (nativo, con hot-reload)
npm run start:dev
```

La API queda en [http://localhost:3000](http://localhost:3000), health check en [http://localhost:3000/health](http://localhost:3000/health).

> Detalle de variables y Docker: [docs/05-entorno-local.md](docs/05-entorno-local.md).
> Flujo diario de desarrollo: [docs/06-desarrollo.md](docs/06-desarrollo.md).

---

## 📜 Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run build` | Compila a `dist/` (antes regenera el cliente Prisma) |
| `npm run start:prod` | Corre la versión compilada (`node dist/main`) |
| `npm run test` | Tests unitarios |
| `npm run test:e2e` | Tests end-to-end |
| `npm run test:cov` | Tests con cobertura |
| `npm run lint` | ESLint con autocorrección |
| `npm run format` | Formato con Prettier |

---

## 📚 Documentación

| # | Tema | Ir |
|---|------|----|
| 01 | Introducción | [Abrir](docs/01-introduccion.md) |
| 02 | Stack tecnológico | [Abrir](docs/02-stack.md) |
| 03 | Arquitectura de módulos | [Abrir](docs/03-arquitectura.md) |
| 04 | Base de datos | [Abrir](docs/04-base-de-datos.md) |
| 05 | Entorno local | [Abrir](docs/05-entorno-local.md) |
| 06 | Desarrollo local | [Abrir](docs/06-desarrollo.md) |
| 07 | API endpoints | [Abrir](docs/07-api.md) |
| 08 | Convenciones y troubleshooting | [Abrir](docs/08-convenciones.md) |
| 09 | Integraciones DNI / RUC | [Abrir](docs/09-integraciones-dni-ruc.md) |
| 10 | Cloudinary (media) | [Abrir](docs/10-cloudinary.md) |

---

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feat/mi-feature`.
2. Commitea: `git commit -m "feat: agregar mi feature"`.
3. Push y abre un Pull Request.

- Sigue el estilo existente (Prettier + ESLint) y las [convenciones](docs/08-convenciones.md).
- Escribe tests para la funcionalidad nueva.
- Todo acceso a BD pasa por `PrismaService`.

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com/">NestJS</a>
</p>
