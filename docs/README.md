# TURTLE-Backend

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E) ![Node](https://img.shields.io/badge/Node-24.15.0-339933) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6) ![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)

Backend del sistema de gestión para restaurante **TURTLE**. API REST construida con NestJS 11, Prisma 7 y PostgreSQL 18.

---

## Cómo usar esta guía

Cada documento explica un aspecto concreto del proyecto. Puedes seguirlos en orden o saltar al que te interese.

```mermaid
flowchart LR
    A["01 Introducción"] --> B["02 Stack"]
    B --> C["03 Arquitectura"]
    C --> D["04 Base de Datos"]
    D --> E["05 Docker"]
    E --> F["06 Desarrollo"]
    F --> G["07 API"]
    G --> H["08 Convenciones"]
    H --> I["09 DNI / RUC"]
    I --> J["10 Cloudinary"]

    style A fill:#1f6feb,stroke:#58a6ff,color:#fff
    style B fill:#1f6feb,stroke:#58a6ff,color:#fff
    style C fill:#1f6feb,stroke:#58a6ff,color:#fff
    style D fill:#1f6feb,stroke:#58a6ff,color:#fff
    style E fill:#1f6feb,stroke:#58a6ff,color:#fff
    style F fill:#1f6feb,stroke:#58a6ff,color:#fff
    style G fill:#1f6feb,stroke:#58a6ff,color:#fff
    style H fill:#238636,stroke:#3fb950,color:#fff
    style I fill:#238636,stroke:#3fb950,color:#fff
    style J fill:#238636,stroke:#3fb950,color:#fff
```

---

## Ruta de aprendizaje

| # | Tema | Ir |
|---|------|----|
| 01 | ¿Qué es TURTLE-Backend? | [Abrir](./01-introduccion.md) |
| 02 | Stack tecnológico | [Abrir](./02-stack.md) |
| 03 | Arquitectura de módulos | [Abrir](./03-arquitectura.md) |
| 04 | Base de datos | [Abrir](./04-base-de-datos.md) |
| 05 | Docker | [Abrir](./05-docker.md) |
| 06 | Desarrollo local | [Abrir](./06-desarrollo.md) |
| 07 | API endpoints | [Abrir](./07-api.md) |
| 08 | Convenciones y troubleshooting | [Abrir](./08-convenciones.md) |
| 09 | Integraciones DNI / RUC | [Abrir](./09-integraciones-dni-ruc.md) |
| 10 | Cloudinary (media) | [Abrir](./10-cloudinary.md) |

---

## De un vistazo

```
src/
├── main.ts                    # Entry point
├── app.module.ts              # Módulo raíz
├── app.controller.ts          # GET /
├── app.service.ts             # Servicio raíz
├── prisma/                    # Conexión a BD (global)
├── health/                    # Health checks (Terminus)
└── integrations/              # Proveedores externos
    ├── ruc/                   # OpenRUC (SUNAT)
    ├── dni/                   # ApiInti (RENIEC)
    └── cloudinary/            # Upload de imágenes
```

---

[Siguiente: Introducción &rarr;](./01-introduccion.md)
