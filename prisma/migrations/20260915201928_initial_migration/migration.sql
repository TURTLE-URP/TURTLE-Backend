-- CreateEnum
CREATE TYPE "pedido_tipo" AS ENUM ('para_llevar', 'local', 'delivery');

-- CreateEnum
CREATE TYPE "mesa_piso" AS ENUM ('piso_1', 'piso_2');

-- CreateEnum
CREATE TYPE "pago_medio_pago" AS ENUM ('efectivo', 'transferencia', 'yape', 'plin');

-- CreateEnum
CREATE TYPE "platos_categoria" AS ENUM ('postre', 'entrada', 'principal', 'refresco');

-- CreateEnum
CREATE TYPE "movimiento_estado" AS ENUM ('pendiente', 'en_preparacion', 'terminado');

-- CreateEnum
CREATE TYPE "usuario_tipo" AS ENUM ('trabajador', 'cliente_digital');

-- CreateEnum
CREATE TYPE "trabajador_rol" AS ENUM ('anfitrion', 'mozo', 'cocinero', 'asistente_de_cocina', 'almacenero', 'jefe', 'administrador');

-- CreateEnum
CREATE TYPE "cliente_auth_provider" AS ENUM ('google');

-- CreateEnum
CREATE TYPE "auditoria_accion" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "proveedor_contacto_tipo" AS ENUM ('WhatsApp', 'Correo');

-- CreateEnum
CREATE TYPE "unidad_tipo" AS ENUM ('masa', 'volumen');

-- CreateEnum
CREATE TYPE "orden_estado" AS ENUM ('emitida', 'cancelada');

-- CreateEnum
CREATE TYPE "movimiento_almacen_tipo" AS ENUM ('ENTRADA_DISTRIBUCION', 'SALIDA_COMANDA', 'AJUSTE_INVENTARIO', 'MERMA');

-- CreateEnum
CREATE TYPE "reporte_merma_estado" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateTable
CREATE TABLE "Pedido" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "IGV" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "documento_cliente_local" TEXT,
    "nombre_cliente_local" TEXT,
    "tipo" "pedido_tipo" NOT NULL,
    "id_mesa" BIGINT,
    "id_cliente_digital" BIGINT,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT,
    "updated_at" TIMESTAMP NOT NULL,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesa" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "numero_mesa" SMALLINT NOT NULL,
    "capacidad" SMALLINT NOT NULL,
    "ocupado" BOOLEAN NOT NULL DEFAULT false,
    "piso" "mesa_piso" NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago_Cliente" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "medio_pago" "pago_medio_pago" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "url_comprobante" TEXT,
    "id_pedido" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Pago_Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Pedido" (
    "id" BIGSERIAL NOT NULL,
    "id_menu_item" BIGINT NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "id_pedido" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Pago_Cliente" (
    "id" BIGSERIAL NOT NULL,
    "id_menu_item" BIGINT NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "IGV" DECIMAL(10,2) NOT NULL,
    "id_pago" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Pago_Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platos_Menu" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" "platos_categoria" NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Platos_Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comanda" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "listo" BOOLEAN NOT NULL DEFAULT false,
    "fecha_hora_emision" TIMESTAMP NOT NULL,
    "fecha_hora_listo" TIMESTAMP,
    "id_pedido" BIGINT NOT NULL,

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Comanda" (
    "id" BIGSERIAL NOT NULL,
    "id_menu_item" BIGINT NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "notas" TEXT,
    "id_comanda" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimientos_Cocina" (
    "id" BIGSERIAL NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL,
    "estado_platillo" "movimiento_estado" NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "id_detalle_comanda" BIGINT NOT NULL,

    CONSTRAINT "Movimientos_Cocina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredientes_Plato" (
    "id" BIGSERIAL NOT NULL,
    "id_insumo" BIGINT NOT NULL,
    "id_medida_insumo" BIGINT NOT NULL,
    "cantidad" DECIMAL NOT NULL,
    "id_almacen_sustraccion" BIGINT NOT NULL,
    "id_plato" BIGINT NOT NULL,

    CONSTRAINT "Ingredientes_Plato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "tipo_usuario" "usuario_tipo" NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "id" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "trabajador_rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente_Digital" (
    "id" BIGINT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "auth_provider" "cliente_auth_provider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,

    CONSTRAINT "Cliente_Digital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria_Sistema" (
    "id" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "accion" "auditoria_accion" NOT NULL,
    "tabla_afectada" TEXT NOT NULL,
    "row_id" TEXT NOT NULL,
    "direccion_ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP NOT NULL,

    CONSTRAINT "Auditoria_Sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos_Proveedor" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "SKU" TEXT,
    "id_insumo" BIGINT NOT NULL,
    "id_insumo_medida" BIGINT NOT NULL,
    "factor_conversion" DECIMAL NOT NULL,
    "id_proveedor" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "precio_referencial" DECIMAL(10,2),

    CONSTRAINT "Productos_Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insumo" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock_ideal" DECIMAL NOT NULL,
    "stock_min" DECIMAL NOT NULL,
    "id_unidad_base" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Almacen" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "condicion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor_Contacto" (
    "id" BIGSERIAL NOT NULL,
    "id_proveedor" BIGINT NOT NULL,
    "nombre_contacto" TEXT NOT NULL,
    "tipo" "proveedor_contacto_tipo" NOT NULL,
    "contacto" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,
    "deleted_at" TIMESTAMP,
    "deleted_by" BIGINT,

    CONSTRAINT "Proveedor_Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidad_Medida" (
    "id" BIGSERIAL NOT NULL,
    "factor_canonico" DECIMAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "tipo" "unidad_tipo" NOT NULL,

    CONSTRAINT "Unidad_Medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insumo_Medidas" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "factor_a_base" DECIMAL NOT NULL,
    "id_insumo" BIGINT NOT NULL,

    CONSTRAINT "Insumo_Medidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orden_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "orden_estado" NOT NULL DEFAULT 'emitida',
    "emitida_a" BIGINT NOT NULL,
    "fecha_hora_emision" TIMESTAMP NOT NULL,
    "emitida_por" BIGINT NOT NULL,
    "fecha_hora_cancelacion" TIMESTAMP,
    "cancelada_por" BIGINT,
    "motivo_cancelacion" TEXT,
    "id_factura" BIGINT,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" BIGINT,

    CONSTRAINT "Orden_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Orden_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "id_producto_proveedor" BIGINT NOT NULL,
    "id_orden_abasto" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Orden_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arribo_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "url_acta_conformidad" TEXT NOT NULL,
    "recibido_por" BIGINT NOT NULL,
    "fecha_hora_recepcion" TIMESTAMP NOT NULL,
    "id_orden_abasto" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,

    CONSTRAINT "Arribo_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Arribo_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "cantidad" SMALLINT NOT NULL,
    "id_producto_proveedor" BIGINT NOT NULL,
    "id_arribo_abasto" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Arribo_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" BIGSERIAL NOT NULL,
    "url_factura_xml" TEXT NOT NULL,
    "url_factura_pdf" TEXT,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagos_Factura" (
    "id" BIGSERIAL NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "url_comprobante" TEXT,
    "id_factura" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT NOT NULL,

    CONSTRAINT "Pagos_Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribucion_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "fecha_hora_distribucion" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "id_arribo_abasto" BIGINT NOT NULL,

    CONSTRAINT "Distribucion_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalles_Distribucion_Abasto" (
    "id" BIGSERIAL NOT NULL,
    "id_insumo" BIGINT NOT NULL,
    "id_insumo_medida" BIGINT NOT NULL,
    "cantidad" DECIMAL,
    "id_almacen" BIGINT NOT NULL,
    "id_distribucion_abasto" BIGINT NOT NULL,

    CONSTRAINT "Detalles_Distribucion_Abasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock_Almacen" (
    "id" BIGSERIAL NOT NULL,
    "id_almacen" BIGINT NOT NULL,
    "id_insumo" BIGINT NOT NULL,
    "stock_actual" DECIMAL NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Stock_Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimiento_Almacen" (
    "id" SERIAL NOT NULL,
    "id_stock_almacen" BIGINT NOT NULL,
    "tipo" "movimiento_almacen_tipo" NOT NULL,
    "cantidad" DECIMAL NOT NULL,
    "saldo_anterior" DECIMAL NOT NULL,
    "saldo_nuevo" DECIMAL NOT NULL,
    "id_insumo_medida" BIGINT NOT NULL,
    "id_detalle_distribucion" BIGINT,
    "id_comanda" BIGINT,
    "id_merma" BIGINT,
    "created_at" TIMESTAMP NOT NULL,
    "created_by" BIGINT,

    CONSTRAINT "Movimiento_Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merma_Insumo" (
    "id" BIGSERIAL NOT NULL,
    "id_stock_almacen" BIGINT NOT NULL,
    "cantidad" DECIMAL NOT NULL,
    "id_insumo_medida" BIGINT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "reportado_por" BIGINT NOT NULL,
    "revisado_por" BIGINT,
    "estado" "reporte_merma_estado" NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Merma_Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia_Merma" (
    "id" BIGSERIAL NOT NULL,
    "url_evidencia" TEXT NOT NULL,
    "id_merma" BIGINT NOT NULL,

    CONSTRAINT "Evidencia_Merma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_key" ON "Pedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_codigo_key" ON "Mesa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_Cliente_codigo_key" ON "Pago_Cliente"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Comanda_codigo_key" ON "Comanda"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_Digital_provider_user_id_key" ON "Cliente_Digital"("provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Productos_Proveedor_codigo_key" ON "Productos_Proveedor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_codigo_key" ON "Insumo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Almacen_codigo_key" ON "Almacen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_codigo_key" ON "Proveedor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_ruc_key" ON "Proveedor"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Orden_Abasto_codigo_key" ON "Orden_Abasto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Arribo_Abasto_codigo_key" ON "Arribo_Abasto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Distribucion_Abasto_codigo_key" ON "Distribucion_Abasto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_Almacen_id_almacen_id_insumo_key" ON "Stock_Almacen"("id_almacen", "id_insumo");

-- CreateIndex
CREATE UNIQUE INDEX "Movimiento_Almacen_id_detalle_distribucion_key" ON "Movimiento_Almacen"("id_detalle_distribucion");

-- CreateIndex
CREATE UNIQUE INDEX "Movimiento_Almacen_id_merma_key" ON "Movimiento_Almacen"("id_merma");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "Mesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_id_cliente_digital_fkey" FOREIGN KEY ("id_cliente_digital") REFERENCES "Cliente_Digital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago_Cliente" ADD CONSTRAINT "Pago_Cliente_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pedido" ADD CONSTRAINT "Detalles_Pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pedido" ADD CONSTRAINT "Detalles_Pedido_id_menu_item_fkey" FOREIGN KEY ("id_menu_item") REFERENCES "Platos_Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pago_Cliente" ADD CONSTRAINT "Detalles_Pago_Cliente_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pago_Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Pago_Cliente" ADD CONSTRAINT "Detalles_Pago_Cliente_id_menu_item_fkey" FOREIGN KEY ("id_menu_item") REFERENCES "Platos_Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Comanda" ADD CONSTRAINT "Detalles_Comanda_id_comanda_fkey" FOREIGN KEY ("id_comanda") REFERENCES "Comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Comanda" ADD CONSTRAINT "Detalles_Comanda_id_menu_item_fkey" FOREIGN KEY ("id_menu_item") REFERENCES "Platos_Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimientos_Cocina" ADD CONSTRAINT "Movimientos_Cocina_id_detalle_comanda_fkey" FOREIGN KEY ("id_detalle_comanda") REFERENCES "Detalles_Comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredientes_Plato" ADD CONSTRAINT "Ingredientes_Plato_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredientes_Plato" ADD CONSTRAINT "Ingredientes_Plato_id_medida_insumo_fkey" FOREIGN KEY ("id_medida_insumo") REFERENCES "Insumo_Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredientes_Plato" ADD CONSTRAINT "Ingredientes_Plato_id_almacen_sustraccion_fkey" FOREIGN KEY ("id_almacen_sustraccion") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredientes_Plato" ADD CONSTRAINT "Ingredientes_Plato_id_plato_fkey" FOREIGN KEY ("id_plato") REFERENCES "Platos_Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajador" ADD CONSTRAINT "Trabajador_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente_Digital" ADD CONSTRAINT "Cliente_Digital_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos_Proveedor" ADD CONSTRAINT "Productos_Proveedor_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos_Proveedor" ADD CONSTRAINT "Productos_Proveedor_id_insumo_medida_fkey" FOREIGN KEY ("id_insumo_medida") REFERENCES "Insumo_Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos_Proveedor" ADD CONSTRAINT "Productos_Proveedor_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_id_unidad_base_fkey" FOREIGN KEY ("id_unidad_base") REFERENCES "Unidad_Medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedor_Contacto" ADD CONSTRAINT "Proveedor_Contacto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insumo_Medidas" ADD CONSTRAINT "Insumo_Medidas_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_Abasto" ADD CONSTRAINT "Orden_Abasto_emitida_a_fkey" FOREIGN KEY ("emitida_a") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden_Abasto" ADD CONSTRAINT "Orden_Abasto_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Orden_Abasto" ADD CONSTRAINT "Detalles_Orden_Abasto_id_producto_proveedor_fkey" FOREIGN KEY ("id_producto_proveedor") REFERENCES "Productos_Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Orden_Abasto" ADD CONSTRAINT "Detalles_Orden_Abasto_id_orden_abasto_fkey" FOREIGN KEY ("id_orden_abasto") REFERENCES "Orden_Abasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arribo_Abasto" ADD CONSTRAINT "Arribo_Abasto_id_orden_abasto_fkey" FOREIGN KEY ("id_orden_abasto") REFERENCES "Orden_Abasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Arribo_Abasto" ADD CONSTRAINT "Detalles_Arribo_Abasto_id_producto_proveedor_fkey" FOREIGN KEY ("id_producto_proveedor") REFERENCES "Productos_Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Arribo_Abasto" ADD CONSTRAINT "Detalles_Arribo_Abasto_id_arribo_abasto_fkey" FOREIGN KEY ("id_arribo_abasto") REFERENCES "Arribo_Abasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos_Factura" ADD CONSTRAINT "Pagos_Factura_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "Factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribucion_Abasto" ADD CONSTRAINT "Distribucion_Abasto_id_arribo_abasto_fkey" FOREIGN KEY ("id_arribo_abasto") REFERENCES "Arribo_Abasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" ADD CONSTRAINT "Detalles_Distribucion_Abasto_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" ADD CONSTRAINT "Detalles_Distribucion_Abasto_id_insumo_medida_fkey" FOREIGN KEY ("id_insumo_medida") REFERENCES "Insumo_Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" ADD CONSTRAINT "Detalles_Distribucion_Abasto_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" ADD CONSTRAINT "Detalles_Distribucion_Abasto_id_distribucion_abasto_fkey" FOREIGN KEY ("id_distribucion_abasto") REFERENCES "Distribucion_Abasto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_Almacen" ADD CONSTRAINT "Stock_Almacen_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_Almacen" ADD CONSTRAINT "Stock_Almacen_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Almacen" ADD CONSTRAINT "Movimiento_Almacen_id_stock_almacen_fkey" FOREIGN KEY ("id_stock_almacen") REFERENCES "Stock_Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Almacen" ADD CONSTRAINT "Movimiento_Almacen_id_insumo_medida_fkey" FOREIGN KEY ("id_insumo_medida") REFERENCES "Insumo_Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Almacen" ADD CONSTRAINT "Movimiento_Almacen_id_detalle_distribucion_fkey" FOREIGN KEY ("id_detalle_distribucion") REFERENCES "Detalles_Distribucion_Abasto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Almacen" ADD CONSTRAINT "Movimiento_Almacen_id_comanda_fkey" FOREIGN KEY ("id_comanda") REFERENCES "Comanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Almacen" ADD CONSTRAINT "Movimiento_Almacen_id_merma_fkey" FOREIGN KEY ("id_merma") REFERENCES "Merma_Insumo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma_Insumo" ADD CONSTRAINT "Merma_Insumo_id_stock_almacen_fkey" FOREIGN KEY ("id_stock_almacen") REFERENCES "Stock_Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma_Insumo" ADD CONSTRAINT "Merma_Insumo_id_insumo_medida_fkey" FOREIGN KEY ("id_insumo_medida") REFERENCES "Insumo_Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia_Merma" ADD CONSTRAINT "Evidencia_Merma_id_merma_fkey" FOREIGN KEY ("id_merma") REFERENCES "Merma_Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
