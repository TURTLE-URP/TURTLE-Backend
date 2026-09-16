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

**Health check del sistema.** Usa `@nestjs/terminus` para verificar conectividad.

```bash
curl http://localhost:3000/health
```

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "info": {
    "nestjs-docs": { "status": "up" },
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

> ⚠️ El indicador `nestjs-docs` hace ping a docs.nestjs.com, por lo que el health check requiere acceso a internet.

| Indicador | Verifica |
|---|---|
| `nestjs-docs` | HTTP ping a docs.nestjs.com |
| `database` | Prisma ping a PostgreSQL |

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