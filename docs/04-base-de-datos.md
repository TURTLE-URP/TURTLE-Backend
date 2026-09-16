# 04 — Base de datos

## Enfoque: Schema-First con migraciones de Prisma

El esquema se define en `prisma/schema.prisma` (**fuente de verdad**) y las migraciones se aplican con Prisma Migrate:

```
prisma/
├── schema.prisma              # Modelos y enums (fuente de verdad)
├── migrations/                # Migraciones SQL versionadas
│   └── 20260915201928_initial_migration/
│       └── migration.sql
├── seed.ts                    # Seed de datos (pendiente de implementar)
├── config.ts                  # Configuración usada por la CLI de Prisma
```

Además, `database/scripts/initialization/` contiene scripts SQL que el contenedor de PostgreSQL ejecuta **automáticamente** la primera vez que arranca (vía `/docker-entrypoint-initdb.d`):

```
database/scripts/initialization/
├── 01_users.sql       # Crea prisma_dev_user (usuario del cliente Prisma)
└── 02_privileges.sql  # Permisos para migraciones y acceso a la BD
```

```mermaid
flowchart LR
    Schema["Editas\nschema.prisma"] -->|"prisma migrate dev"| BD["PostgreSQL 18"]
    BD -->|"prisma generate"| Client["Cliente TS\nautogenerado"]
    Client --> App["Código NestJS"]

    style Schema fill:#9e6a03,stroke:#d29922,color:#fff
    style BD fill:#238636,stroke:#3fb950,color:#fff
    style Client fill:#1f6feb,stroke:#58a6ff,color:#fff
    style App fill:#8957e5,stroke:#bc8cff,color:#fff
```

---

## Modelos (33 tablas)

### Pedidos y mesas (5)

| Modelo | Descripción |
|---|---|
| `Mesa` | Mesas del local (piso, capacidad, ocupación) |
| `Pedido` | Pedidos (tipo, IGV, subtotal, cliente/mesa) |
| `Pago_Cliente` | Pagos de clientes (medio, monto, comprobante) |
| `Detalles_Pedido` | Líneas de un pedido (plato + cantidad) |
| `Detalles_Pago_Cliente` | Desglose de un pago por plato |

### Menú, comandas y cocina (5)

| Modelo | Descripción |
|---|---|
| `Platos_Menu` | Platos del menú (precio, categoría) |
| `Ingredientes_Plato` | Receta: insumos por plato |
| `Comanda` | Comandas emitidas a cocina |
| `Detalles_Comanda` | Líneas de una comanda |
| `Movimientos_Cocina` | Estados de cada platillo en cocina |

### Insumos, almacenes y stock (8)

| Modelo | Descripción |
|---|---|
| `Insumo` | Insumos (código, stock mínimo/ideal) |
| `Unidad_Medida` | Unidades canónicas (masa, volumen) |
| `Insumo_Medidas` | Unidades por insumo con factor a base |
| `Almacen` | Almacenes / zonas de almacenamiento |
| `Stock_Almacen` | Stock de un insumo en un almacén |
| `Movimiento_Almacen` | Transacciones de stock (entradas/salidas/ajustes/mermas) |
| `Merma_Insumo` | Reportes de merma con aprobación |
| `Evidencia_Merma` | Evidencias (fotos) de mermas |

### Proveedores y abastecimiento (11)

| Modelo | Descripción |
|---|---|
| `Proveedor` | Proveedores (RUC único, razón social) |
| `Proveedor_Contacto` | Contactos por proveedor (WhatsApp, correo) |
| `Productos_Proveedor` | Catálogo por proveedor (factor de conversión, precio) |
| `Factura` | Facturas (XML, PDF) |
| `Pagos_Factura` | Pagos asociados a una factura |
| `Orden_Abasto` | Órdenes de compra a proveedores |
| `Detalles_Orden_Abasto` | Líneas de una orden |
| `Arribo_Abasto` | Recepción de mercadería (acta de conformidad) |
| `Detalles_Arribo_Abasto` | Líneas de un arribo |
| `Distribucion_Abasto` | Distribución de lo recibido a almacenes |
| `Detalles_Distribucion_Abasto` | Líneas de una distribución (insumo → almacén) |

### Usuarios y auditoría (4)

| Modelo | Descripción |
|---|---|
| `Usuario` | Usuarios del sistema (trabajador o cliente digital) |
| `Trabajador` | Datos del personal (rol, credenciales) |
| `Cliente_Digital` | Clientes autenticados (auth provider) |
| `Auditoria_Sistema` | Registro de acciones CREATE / UPDATE / DELETE |

---

## Enums (14)

| Enum | Valores |
|---|---|
| `pedido_tipo` | `para_llevar` · `local` · `delivery` |
| `mesa_piso` | `piso_1` · `piso_2` |
| `pago_medio_pago` | `efectivo` · `transferencia` · `yape` · `plin` |
| `platos_categoria` | `postre` · `entrada` · `principal` · `refresco` |
| `movimiento_estado` | `pendiente` · `en_preparacion` · `terminado` |
| `usuario_tipo` | `trabajador` · `cliente_digital` |
| `trabajador_rol` | `anfitrion` · `mozo` · `cocinero` · `asistente_de_cocina` · `almacenero` · `jefe` · `administrador` |
| `cliente_auth_provider` | `google` |
| `auditoria_accion` | `CREATE` · `UPDATE` · `DELETE` |
| `proveedor_contacto_tipo` | `WhatsApp` · `Correo` |
| `unidad_tipo` | `masa` · `volumen` |
| `orden_estado` | `emitida` · `cancelada` |
| `movimiento_almacen_tipo` | `ENTRADA_DISTRIBUCION` · `SALIDA_COMANDA` · `AJUSTE_INVENTARIO` · `MERMA` |
| `reporte_merma_estado` | `pendiente` · `aprobado` · `rechazado` |

---

## Convenciones de naming

- **Modelos** en español, singular y `PascalCase` (`Platos_Menu`, `Stock_Almacen`).
- **Columnas** en `snake_case` (Prisma los genera así en la BD).
- Primary keys: `id BigInt @id @default(autoincrement())`.
- Columnas de auditoría: `created_at`, `updated_at`, `deleted_at` + `created_by` / `updated_by` / `deleted_by` (patrón de borrado lógico con trazabilidad).
- Relaciones: `@@relation(fields: [...], references: [...])` con campo FK `id_*`.

---

## Workflow de cambios

```bash
# 1. Editar prisma/schema.prisma
# 2. Crear y aplicar la migración (crea BD shadow si es necesario)
npx prisma migrate dev --name "descripcion_del_cambio"

# 3. Regenerar el cliente TypeScript
npx prisma generate

# 4. Commitear schema.prisma + la carpeta de migración nueva
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): agregar columna X a tabla Y"
```

> En CI/despliegues se aplican las migraciones ya versionadas con `npx prisma migrate deploy`.

---

## Conexión

El cliente usa `DATABASE_URL` (ver `.env.template`). Dentro de Docker el host es `postgres-db`; fuera de Docker usa `localhost`:

```
postgresql://prisma_dev_user:prisma@postgres-db:5432/turtle   # dentro de Docker
postgresql://prisma_dev_user:prisma@localhost:5432/turtle     # desarrollo local
```

El usuario `prisma_dev_user` y sus permisos se crean automáticamente por los scripts de `database/scripts/initialization/`.

---

[&larr; Anterior: Arquitectura](./03-arquitectura.md) | [Siguiente: Docker &rarr;](./05-docker.md)