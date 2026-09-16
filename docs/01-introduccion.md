# 01 — ¿Qué es TURTLE-Backend?

## ¿Qué problema resuelve?

Un restaurante necesita controlar:

- **Inventario** de insumos (qué hay, dónde está, cuánto falta)
- **Proveedores** y sus catálogos de productos
- **Menú** (ítems, combos, recetas)
- **Pedidos** de clientes (mesa, tipo, estado, pago)

Sin un sistema, todo se lleva en papel, Excel o en la cabeza del cocinero. TURTLE-Backend centraliza esto en una API REST.

---

## ¿Qué hace?

| Funcionalidad | Estado |
|---|---|
| Health checks (API + BD) | ✅ Listo |
| Consulta de RUC (OpenRUC) | ✅ Listo |
| Consulta de DNI (ApiInti) | ✅ Listo |
| Subida y borrado de media (Cloudinary) | ✅ Listo |
| CRUD de insumos | ⏳ Pendiente |
| Control de stock | ⏳ Pendiente |
| Gestión de proveedores | ⏳ Pendiente |
| Gestión de menú y pedidos | ⏳ Pendiente |

---

## ¿Cómo está construido?

```mermaid
flowchart TB
    Cliente["Cliente HTTP\n(App móvil / Web)"] --> API["API REST\nNestJS 11"]
    API --> BD["PostgreSQL 18\n(Database)"]
    API --> Health["Health Checks\nTerminus"]

    style Cliente fill:#30363d,stroke:#8b949e,color:#fff
    style API fill:#1f6feb,stroke:#58a6ff,color:#fff
    style BD fill:#238636,stroke:#3fb950,color:#fff
    style Health fill:#9e6a03,stroke:#d29922,color:#fff
```

- **API REST** con NestJS 11
- **Base de datos** PostgreSQL 18 (levantada con Docker, solo la BD)
- **ORM** Prisma 7 con `adapter-pg`
- **Backend nativo**: `npm run start:dev` con hot-reload en tu máquina

---

## ¿Para quién es esta guía?

- **Desarrolladores** que se incorporan al proyecto
- **Tú del futuro** que olvidaste cómo funciona esto
- **Cualquier persona** que quiera entender el backend

---

[&larr; Volver al inicio](./README.md) | [Siguiente: Stack tecnológico &rarr;](./02-stack.md)
