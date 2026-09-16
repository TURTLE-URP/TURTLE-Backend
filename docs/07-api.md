# 07 — API endpoints

La referencia viva es **Swagger UI en `http://localhost:3000/api`** (spec en `/api-json`): se genera desde decoradores + plugin y siempre refleja el código. Lo de abajo es el resumen conceptual.

---

## Resumen por tag

| Tag | Endpoints | Detalle |
|---|---|---|
| `root` | `GET /` | Ping básico |
| `health` | `GET /health`, `GET /health/live` | Ver abajo |
| `ruc` | `GET /ruc/:numero` | RUC 11 dígitos, sin API key. Ver [09](./09-integraciones-dni-ruc.md) |
| `dni` | `GET /dni/:numero` | DNI 8 dígitos, requiere `APIINTI_API_KEY`. Ver [09](./09-integraciones-dni-ruc.md) |
| `media` | `POST /media/upload`, `DELETE /media` | Multipart (máx. 5MB) y borrado por `publicId`. Ver [10](./10-cloudinary.md) |

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
| Códigos | REST estándar (200, 201, 400, 404, 503) |
| Errores | `{ statusCode, message, error }` |
| Validación | `ValidationPipe` global (`whitelist` + `transform`): bodies fuera de contrato dan 400 |

---

[&larr; Anterior: Desarrollo](./06-desarrollo.md) | [Siguiente: Convenciones &rarr;](./08-convenciones.md)
