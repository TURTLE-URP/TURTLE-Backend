# 07 — API endpoints

La referencia viva es **Swagger UI en `http://localhost:3000/api`** (spec en `/api-json`): se genera desde decoradores + plugin y siempre refleja el código. Lo de abajo es el resumen conceptual.

---

## Resumen por tag

| Tag | Endpoints | Detalle |
|---|---|---|
| `root` | `GET /` | Ping básico |
| `health` | `GET /health`, `GET /health/live` | Ver abajo |
| `auth` | `POST /auth/login`, `GET /auth/me` | Login trabajador (público, 200 + 401), payload del token (bearer). Ver abajo |
| `Trabajadores` | `POST /workers`, `GET /workers`, `GET /workers/:id`, `PATCH /workers/:id`, `PATCH /workers/:id/activo`, `DELETE /workers/:id` | CRUD + activar/desactivar + baja lógica. Solo `administrador`/`jefe`. Ver abajo |
| `clientes` | `POST api/customers`, `GET api/customers/:id`, `DELETE api/customers/:id` | Clientes digitales |
| `tables` | `GET api/tables`, `GET api/tables/:tableNumber`, `PATCH api/tables/:tableNumber/status` | Mesas y ocupación |
| `orders` | `POST api/orders`, `GET api/orders`, `GET api/orders/:id`, `GET api/orders/table/:tableNumber`, `PATCH api/orders/:id/status`, `PATCH api/orders/:id/items/:itemId/status` | Pedidos y estados |
| `payments` | `POST api/payments`, `GET api/payments`, `GET api/payments/:id`, `GET api/payments/order/:orderId`, `PATCH api/payments/:id`, `DELETE api/payments/:id`, `POST api/payments/:id/details`, `PATCH api/payments/details/:detailId`, `DELETE api/payments/details/:detailId` | Pagos y detalles |
| `comandas` | `POST api/comandas`, `GET api/comandas`, `GET api/comandas/:id`, `GET api/comandas/order/:orderId`, `PATCH api/comandas/:id`, `DELETE api/comandas/:id`, `POST api/comandas/:id/items`, `PATCH api/comandas/items/:itemId`, `DELETE api/comandas/items/:itemId`, `POST api/comandas/items/:itemId/movements`, `GET api/comandas/items/:itemId/movements` | Comandas, cocina y movimientos |
| `menu-items` | `GET api/menu-items`, `GET api/menu-items/:id` | Platos (solo lectura) |
| `supply-orders` | `GET /supply-orders/metrics`, `GET /supply-orders/dishes`, `GET /supply-orders/free-supplies`, `GET /supply-orders/calculate-by-shortage`, `GET /supply-orders`, `POST /supply-orders/calculate-by-dishes`, `POST /supply-orders` | Abastecimiento y métricas |
| `audit` | `POST api/audit`, `GET api/audit`, `GET api/audit/user/:userId`, `GET api/audit/:id` | Auditoría del sistema |
| `ruc` | `GET /ruc/:numero` | RUC 11 dígitos, sin API key. Ver [09](./09-integraciones-dni-ruc.md) |
| `dni` | `GET /dni/:numero` | DNI 8 dígitos, requiere `APIINTI_API_KEY`. Ver [09](./09-integraciones-dni-ruc.md) |
| `media` | `POST /media/upload`, `DELETE /media` | Multipart (máx. 5MB) y borrado por `publicId`. Ver [10](./10-cloudinary.md) |

---

## Auth: login de trabajador

* **`POST /auth/login` (público)** — body `{ email, password }` (`password` mín. 6). 200 `{ access_token, token_type: 'bearer' }`, 401 `Credenciales inválidas` (mensaje genérico: no distingue inexistente/inactivo/clave mala, ni por timing).
* **`GET /auth/me` (bearer)** — devuelve el payload del JWT (`{ sub, email, rol }`).
* Solo `tipo_usuario: 'trabajador'` con `activo: true` y sin baja lógica (`deleted_at: null`) puede loguearse. `cliente_digital` no usa este endpoint (verá Google/OAuth cuando se implemente).
* Flujo en Swagger: `POST /auth/login` → copiar `access_token` → botón `Authorize` → `Bearer <token>`.

### Credenciales seed (solo dev)

`npm run db:seed` crea 4 trabajadores con la misma clave (idempotente, re-ejecutable; `npm run db:unseed` vacía para resembrar; ambos bloqueados en producción):

| Email | Rol | Password |
|---|---|---|
| `admin@turtle.pe` | `administrador` | `changeme123` |
| `jefe@turtle.pe` | `jefe` | `changeme123` |
| `mozo@turtle.pe` | `mozo` | `changeme123` |
| `cocinero@turtle.pe` | `cocinero` | `changeme123` |

---

## Trabajadores

Base: `/workers`, bearer + `@Roles('administrador', 'jefe')` a nivel de controller. Respuestas tipadas como entities (ver [convenciones](./08-convenciones.md)).

| Método | Endpoint | Códigos | Detalle |
|---|---|---|---|
| `POST` | `/workers` | 201, 400, 409, 401, 403 | Crea trabajador. Clave **autogenerada** por el sistema (12 chars), devuelta una vez como `plainPassword` en `CreateWorkerResponse` (TODO: enviar por correo/SES y no exponer en prod). 409 si el correo ya existe |
| `GET` | `/workers?page=&limit=&search=&role=&activo=` | 200, 401, 403 | Lista paginada (`PaginatedWorkersResponse { data, meta }`). `search` cubre nombre/apellido/correo insensible a mayúsculas |
| `GET` | `/workers/:id` | 200, 404, 401, 403 | Un trabajador (`WorkerResponseEntity`) |
| `PATCH` | `/workers/:id` | 200, 404, 401, 403 | Solo `name`/`lastName`. Marca `updated_at`. Rol y `email` no se cambian aquí |
| `PATCH` | `/workers/:id/activo` | 200, 404, 401, 403 | Body `{ activo: boolean }`. `false` bloquea el próximo login sin borrar (reversible) |
| `DELETE` | `/workers/:id` | 200, 404, 401, 403 | Baja lógica: `deleted_at/deleted_by/updated_at` + `activo=false`. `deleted_by` sale del JWT (`@CurrentUserId` estricto) |

---

## Health: dos niveles

* **`GET /health` (readiness)** — ¿puede atender tráfico? Exige PostgreSQL (`SELECT 1`, timeout 2 s). 503 con BD caída.
* **`GET /health/live` (liveness)** — ¿sigue vivo el proceso? Solo heap en memoria, sin I/O. Para probes que deciden reinicios.

> Prueba útil: con `docker compose stop postgres-db`, `/health` debe dar 503 mientras `/health/live` sigue en 200 — eso confirma "mi API vive, mi BD no".

---

## Convenciones generales

| Concepto | Valor |
|---|---|
| Base URL | `http://localhost:3000` |
| Docs interactivas | `http://localhost:3000/api` |
| Content-Type | `application/json` (multipart en `POST /media/upload`) |
| Códigos | REST estándar (200, 201, 400, 401, 403, 404, 409, 503) |
| Errores | `{ statusCode, message, error }`. Auth usa mensaje genérico `Credenciales inválidas` |
| Validación | `ValidationPipe` global (`whitelist` + `transform`): bodies fuera de contrato dan 400 |

---

[&larr; Anterior: Desarrollo](./06-desarrollo.md) | [Siguiente: Convenciones &rarr;](./08-convenciones.md)
