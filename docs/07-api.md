# 07 — API endpoints

## `GET /`

**Respuesta básica del servidor.**

```bash
curl http://localhost:3000/
```

```
Hello World
```

| Código | Descripción |
|---|---|
| 200 | Servidor funcionando |

---

## `GET /health`

**Readiness: ¿puede atender tráfico?** Usa `@nestjs/terminus` para verificar PostgreSQL vía Prisma (`SELECT 1` con timeout de 2 s). No depende de internet ni de integraciones externas.

```bash
curl http://localhost:3000/health
```

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

**Respuesta con fallo (503):**
```json
{
  "status": "error",
  "info": {},
  "error": {
    "database": { "status": "down", "message": "... " }
  }
}
```

| Indicador | Verifica |
|---|---|
| `database` | Prisma ping a PostgreSQL |

> Prueba útil: con `docker compose stop postgres-db`, `/health` debe dar 503 mientras `/health/live` sigue en 200 — eso confirma "mi API vive, mi BD no".

---

## `GET /health/live`

**Liveness: ¿sigue vivo el proceso?** Solo mide el heap de Node en memoria, sin I/O externo (ni BD ni red). Diseñado para probes que deciden **reinicios** (Docker `healthcheck`, K8s `livenessProbe`).

```bash
curl http://localhost:3000/health/live
```

```json
{
  "status": "ok",
  "info": {
    "memory_heap": { "status": "up" }
  }
}
```

---

## `GET /ruc/:numero`

**Consulta RUC vía OpenRUC** (sin API key). Ver [09 — Integraciones](./09-integraciones-dni-ruc.md).

```bash
curl http://localhost:3000/ruc/20100047218
```

---

## `GET /dni/:numero`

**Consulta DNI vía ApiInti** (requiere `APIINTI_API_KEY`). Ver [09 — Integraciones](./09-integraciones-dni-ruc.md).

```bash
curl http://localhost:3000/dni/12345678
```

---

## `POST /media/upload`

**Sube una imagen a Cloudinary.** Ver [10 — Cloudinary](./10-cloudinary.md).

```bash
curl -X POST "http://localhost:3000/media/upload" -F "file=@./foto.png"
```

---

## `DELETE /media`

**Borra una imagen de Cloudinary por `publicId`.**

```bash
curl -X DELETE http://localhost:3000/media \
  -H "Content-Type: application/json" \
  -d '{"publicId":"turtle/abc123"}'
```

---

## Convenciones generales

| Concepto | Valor |
|---|---|
| Base URL | `http://localhost:3000` |
| Content-Type | `application/json` |
| Códigos | REST estándar (200, 201, 400, 404, 503) |
| Errores | `{ statusCode, message, error }` |

---

[&larr; Anterior: Desarrollo](./06-desarrollo.md) | [Siguiente: Convenciones &rarr;](./08-convenciones.md)