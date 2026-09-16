# 03 — Arquitectura de módulos

## Árbol de módulos

```mermaid
graph TD
    AppModule --> ConfigModule
    AppModule --> PrismaModule
    AppModule --> HealthModule
    AppModule --> IntegrationsModule
    IntegrationsModule --> RucModule
    IntegrationsModule --> DniModule
    IntegrationsModule --> CloudinaryModule

    style AppModule fill:#8957e5,stroke:#bc8cff,color:#fff
    style ConfigModule fill:#1f6feb,stroke:#58a6ff,color:#fff
    style PrismaModule fill:#238636,stroke:#3fb950,color:#fff
    style HealthModule fill:#9e6a03,stroke:#d29922,color:#fff
    style IntegrationsModule fill:#d29922,stroke:#f0c000,color:#fff
    style RucModule fill:#58a6ff,stroke:#79c0ff,color:#fff
    style DniModule fill:#58a6ff,stroke:#79c0ff,color:#fff
    style CloudinaryModule fill:#58a6ff,stroke:#79c0ff,color:#fff
```

---

## AppModule (raíz)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    IntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## PrismaModule (global)

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
```

- **Global**: cualquier módulo inyecta `PrismaService` sin importarlo
- Extiende `PrismaClient` usando `@prisma/adapter-pg`
- Lee `DATABASE_URL` desde `ConfigService`

## HealthModule

Expone `GET /health` con dos indicadores:

| Indicador | Qué verifica |
|---|---|
| `nestjs-docs` | Conectividad HTTP externa |
| `database` | Conexión a PostgreSQL |

---

## IntegrationsModule (agrupador)

Consultas externas de identidad (sin persistencia):

| Submódulo | Proveedor | Endpoint |
|---|---|---|
| `RucModule` | OpenRUC | `GET /ruc/:numero` |
| `DniModule` | ApiInti | `GET /dni/:numero` |
| `CloudinaryModule` | Cloudinary | `POST /media/upload`, `DELETE /media` |

Detalle en [09 — DNI/RUC](./09-integraciones-dni-ruc.md) y [10 — Cloudinary](./10-cloudinary.md).

---

## Flujo de una petición

```mermaid
sequenceDiagram
    Client->>Controller: GET /ruc/20100047218
    Controller->>Service: lookup('20100047218')
    Service->>OpenRUC: GET https://openruc.com/api/ruc/20100047218
    OpenRUC-->>Service: JSON
    Service-->>Controller: RucLookup
    Controller-->>Client: JSON response
```

---

## Patrón por módulo

```
modulo/
├── modulo.module.ts      # @Module({ controllers, providers, exports })
├── modulo.controller.ts  # @Controller() con rutas HTTP
├── modulo.service.ts     # @Injectable() con lógica de negocio
├── dto/                  # Data Transfer Objects
├── entities/             # Modelos / entidades
└── *.spec.ts             # Tests
```

---

[&larr; Anterior: Stack](./02-stack.md) | [Siguiente: Base de datos &rarr;](./04-base-de-datos.md)
