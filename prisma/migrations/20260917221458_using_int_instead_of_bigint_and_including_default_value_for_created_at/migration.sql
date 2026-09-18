/*
  Warnings:

  - The primary key for the `Almacen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Arribo_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `recibido_por` on the `Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_orden_abasto` on the `Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_usuario` on the `Auditoria_Sistema` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Cliente_Digital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Cliente_Digital` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Comanda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Comanda` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_pedido` on the `Comanda` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Arribo_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_producto_proveedor` on the `Detalles_Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_arribo_abasto` on the `Detalles_Arribo_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Comanda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Comanda` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_menu_item` on the `Detalles_Comanda` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_comanda` on the `Detalles_Comanda` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Distribucion_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo` on the `Detalles_Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo_medida` on the `Detalles_Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_almacen` on the `Detalles_Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_distribucion_abasto` on the `Detalles_Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Orden_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_producto_proveedor` on the `Detalles_Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_orden_abasto` on the `Detalles_Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Pago_Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Pago_Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_menu_item` on the `Detalles_Pago_Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_pago` on the `Detalles_Pago_Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Detalles_Pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Detalles_Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_menu_item` on the `Detalles_Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_pedido` on the `Detalles_Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Distribucion_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_arribo_abasto` on the `Distribucion_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Evidencia_Merma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Evidencia_Merma` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_merma` on the `Evidencia_Merma` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Factura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Ingredientes_Plato` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ingredientes_Plato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo` on the `Ingredientes_Plato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_medida_insumo` on the `Ingredientes_Plato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_almacen_sustraccion` on the `Ingredientes_Plato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_plato` on the `Ingredientes_Plato` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Insumo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_unidad_base` on the `Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Insumo_Medidas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Insumo_Medidas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo` on the `Insumo_Medidas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Merma_Insumo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Merma_Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_stock_almacen` on the `Merma_Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo_medida` on the `Merma_Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `reportado_por` on the `Merma_Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `revisado_por` on the `Merma_Insumo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Mesa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Mesa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_stock_almacen` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo_medida` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_detalle_distribucion` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_comanda` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_merma` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Movimiento_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Movimientos_Cocina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Movimientos_Cocina` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_detalle_comanda` on the `Movimientos_Cocina` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Orden_Abasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `emitida_a` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `emitida_por` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `cancelada_por` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_factura` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Orden_Abasto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Pago_Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Pago_Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_pedido` on the `Pago_Cliente` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Pagos_Factura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Pagos_Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_factura` on the `Pagos_Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Pagos_Factura` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_mesa` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_cliente_digital` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Platos_Menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Platos_Menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Platos_Menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Platos_Menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Platos_Menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Productos_Proveedor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo_medida` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_proveedor` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Productos_Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Proveedor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Proveedor_Contacto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Proveedor_Contacto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_proveedor` on the `Proveedor_Contacto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `created_by` on the `Proveedor_Contacto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updated_by` on the `Proveedor_Contacto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Proveedor_Contacto` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Stock_Almacen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Stock_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_almacen` on the `Stock_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `id_insumo` on the `Stock_Almacen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Trabajador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Trabajador` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Unidad_Medida` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Unidad_Medida` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `deleted_by` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Arribo_Abasto" DROP CONSTRAINT "Arribo_Abasto_id_orden_abasto_fkey";

-- DropForeignKey
ALTER TABLE "Cliente_Digital" DROP CONSTRAINT "Cliente_Digital_id_fkey";

-- DropForeignKey
ALTER TABLE "Comanda" DROP CONSTRAINT "Comanda_id_pedido_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Arribo_Abasto" DROP CONSTRAINT "Detalles_Arribo_Abasto_id_arribo_abasto_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Arribo_Abasto" DROP CONSTRAINT "Detalles_Arribo_Abasto_id_producto_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Comanda" DROP CONSTRAINT "Detalles_Comanda_id_comanda_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Comanda" DROP CONSTRAINT "Detalles_Comanda_id_menu_item_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" DROP CONSTRAINT "Detalles_Distribucion_Abasto_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" DROP CONSTRAINT "Detalles_Distribucion_Abasto_id_distribucion_abasto_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" DROP CONSTRAINT "Detalles_Distribucion_Abasto_id_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Distribucion_Abasto" DROP CONSTRAINT "Detalles_Distribucion_Abasto_id_insumo_medida_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Orden_Abasto" DROP CONSTRAINT "Detalles_Orden_Abasto_id_orden_abasto_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Orden_Abasto" DROP CONSTRAINT "Detalles_Orden_Abasto_id_producto_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Pago_Cliente" DROP CONSTRAINT "Detalles_Pago_Cliente_id_menu_item_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Pago_Cliente" DROP CONSTRAINT "Detalles_Pago_Cliente_id_pago_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Pedido" DROP CONSTRAINT "Detalles_Pedido_id_menu_item_fkey";

-- DropForeignKey
ALTER TABLE "Detalles_Pedido" DROP CONSTRAINT "Detalles_Pedido_id_pedido_fkey";

-- DropForeignKey
ALTER TABLE "Distribucion_Abasto" DROP CONSTRAINT "Distribucion_Abasto_id_arribo_abasto_fkey";

-- DropForeignKey
ALTER TABLE "Evidencia_Merma" DROP CONSTRAINT "Evidencia_Merma_id_merma_fkey";

-- DropForeignKey
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_id_almacen_sustraccion_fkey";

-- DropForeignKey
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_id_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_id_medida_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_id_plato_fkey";

-- DropForeignKey
ALTER TABLE "Insumo" DROP CONSTRAINT "Insumo_id_unidad_base_fkey";

-- DropForeignKey
ALTER TABLE "Insumo_Medidas" DROP CONSTRAINT "Insumo_Medidas_id_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Merma_Insumo" DROP CONSTRAINT "Merma_Insumo_id_insumo_medida_fkey";

-- DropForeignKey
ALTER TABLE "Merma_Insumo" DROP CONSTRAINT "Merma_Insumo_id_stock_almacen_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Almacen" DROP CONSTRAINT "Movimiento_Almacen_id_comanda_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Almacen" DROP CONSTRAINT "Movimiento_Almacen_id_detalle_distribucion_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Almacen" DROP CONSTRAINT "Movimiento_Almacen_id_insumo_medida_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Almacen" DROP CONSTRAINT "Movimiento_Almacen_id_merma_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Almacen" DROP CONSTRAINT "Movimiento_Almacen_id_stock_almacen_fkey";

-- DropForeignKey
ALTER TABLE "Movimientos_Cocina" DROP CONSTRAINT "Movimientos_Cocina_id_detalle_comanda_fkey";

-- DropForeignKey
ALTER TABLE "Orden_Abasto" DROP CONSTRAINT "Orden_Abasto_emitida_a_fkey";

-- DropForeignKey
ALTER TABLE "Orden_Abasto" DROP CONSTRAINT "Orden_Abasto_id_factura_fkey";

-- DropForeignKey
ALTER TABLE "Pago_Cliente" DROP CONSTRAINT "Pago_Cliente_id_pedido_fkey";

-- DropForeignKey
ALTER TABLE "Pagos_Factura" DROP CONSTRAINT "Pagos_Factura_id_factura_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_id_cliente_digital_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_id_mesa_fkey";

-- DropForeignKey
ALTER TABLE "Productos_Proveedor" DROP CONSTRAINT "Productos_Proveedor_id_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Productos_Proveedor" DROP CONSTRAINT "Productos_Proveedor_id_insumo_medida_fkey";

-- DropForeignKey
ALTER TABLE "Productos_Proveedor" DROP CONSTRAINT "Productos_Proveedor_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "Proveedor_Contacto" DROP CONSTRAINT "Proveedor_Contacto_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "Stock_Almacen" DROP CONSTRAINT "Stock_Almacen_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "Stock_Almacen" DROP CONSTRAINT "Stock_Almacen_id_insumo_fkey";

-- DropForeignKey
ALTER TABLE "Trabajador" DROP CONSTRAINT "Trabajador_id_fkey";

-- AlterTable
ALTER TABLE "Almacen" DROP CONSTRAINT "Almacen_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Arribo_Abasto" DROP CONSTRAINT "Arribo_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "recibido_por" SET DATA TYPE INTEGER,
ALTER COLUMN "fecha_hora_recepcion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_orden_abasto" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Arribo_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Auditoria_Sistema" ALTER COLUMN "id_usuario" SET DATA TYPE INTEGER,
ALTER COLUMN "fecha_hora" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cliente_Digital" DROP CONSTRAINT "Cliente_Digital_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ADD CONSTRAINT "Cliente_Digital_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Comanda" DROP CONSTRAINT "Comanda_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "fecha_hora_emision" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_pedido" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Arribo_Abasto" DROP CONSTRAINT "Detalles_Arribo_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_producto_proveedor" SET DATA TYPE INTEGER,
ALTER COLUMN "id_arribo_abasto" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Arribo_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Comanda" DROP CONSTRAINT "Detalles_Comanda_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_menu_item" SET DATA TYPE INTEGER,
ALTER COLUMN "id_comanda" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Comanda_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Distribucion_Abasto" DROP CONSTRAINT "Detalles_Distribucion_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_insumo" SET DATA TYPE INTEGER,
ALTER COLUMN "id_insumo_medida" SET DATA TYPE INTEGER,
ALTER COLUMN "id_almacen" SET DATA TYPE INTEGER,
ALTER COLUMN "id_distribucion_abasto" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Distribucion_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Orden_Abasto" DROP CONSTRAINT "Detalles_Orden_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_producto_proveedor" SET DATA TYPE INTEGER,
ALTER COLUMN "id_orden_abasto" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Orden_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Pago_Cliente" DROP CONSTRAINT "Detalles_Pago_Cliente_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_menu_item" SET DATA TYPE INTEGER,
ALTER COLUMN "id_pago" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Pago_Cliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Detalles_Pedido" DROP CONSTRAINT "Detalles_Pedido_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_menu_item" SET DATA TYPE INTEGER,
ALTER COLUMN "id_pedido" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Detalles_Pedido_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Distribucion_Abasto" DROP CONSTRAINT "Distribucion_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "fecha_hora_distribucion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_arribo_abasto" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Distribucion_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Evidencia_Merma" DROP CONSTRAINT "Evidencia_Merma_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_merma" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Evidencia_Merma_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ADD CONSTRAINT "Factura_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_insumo" SET DATA TYPE INTEGER,
ALTER COLUMN "id_medida_insumo" SET DATA TYPE INTEGER,
ALTER COLUMN "id_almacen_sustraccion" SET DATA TYPE INTEGER,
ALTER COLUMN "id_plato" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Ingredientes_Plato_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Insumo" DROP CONSTRAINT "Insumo_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_unidad_base" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Insumo_Medidas" DROP CONSTRAINT "Insumo_Medidas_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_insumo" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Insumo_Medidas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Merma_Insumo" DROP CONSTRAINT "Merma_Insumo_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_stock_almacen" SET DATA TYPE INTEGER,
ALTER COLUMN "id_insumo_medida" SET DATA TYPE INTEGER,
ALTER COLUMN "reportado_por" SET DATA TYPE INTEGER,
ALTER COLUMN "revisado_por" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Merma_Insumo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mesa" DROP CONSTRAINT "Mesa_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Movimiento_Almacen" ALTER COLUMN "id_stock_almacen" SET DATA TYPE INTEGER,
ALTER COLUMN "id_insumo_medida" SET DATA TYPE INTEGER,
ALTER COLUMN "id_detalle_distribucion" SET DATA TYPE INTEGER,
ALTER COLUMN "id_comanda" SET DATA TYPE INTEGER,
ALTER COLUMN "id_merma" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Movimientos_Cocina" DROP CONSTRAINT "Movimientos_Cocina_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "fecha_hora" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_detalle_comanda" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Movimientos_Cocina_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Orden_Abasto" DROP CONSTRAINT "Orden_Abasto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "emitida_a" SET DATA TYPE INTEGER,
ALTER COLUMN "fecha_hora_emision" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "emitida_por" SET DATA TYPE INTEGER,
ALTER COLUMN "cancelada_por" SET DATA TYPE INTEGER,
ALTER COLUMN "id_factura" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Orden_Abasto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pago_Cliente" DROP CONSTRAINT "Pago_Cliente_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_pedido" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Pago_Cliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pagos_Factura" DROP CONSTRAINT "Pagos_Factura_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_factura" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Pagos_Factura_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_mesa" SET DATA TYPE INTEGER,
ALTER COLUMN "id_cliente_digital" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Platos_Menu" DROP CONSTRAINT "Platos_Menu_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Platos_Menu_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Productos_Proveedor" DROP CONSTRAINT "Productos_Proveedor_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_insumo" SET DATA TYPE INTEGER,
ALTER COLUMN "id_insumo_medida" SET DATA TYPE INTEGER,
ALTER COLUMN "id_proveedor" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Productos_Proveedor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Proveedor" DROP CONSTRAINT "Proveedor_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Proveedor_Contacto" DROP CONSTRAINT "Proveedor_Contacto_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_proveedor" SET DATA TYPE INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_by" SET DATA TYPE INTEGER,
ALTER COLUMN "updated_by" SET DATA TYPE INTEGER,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Proveedor_Contacto_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stock_Almacen" DROP CONSTRAINT "Stock_Almacen_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "id_almacen" SET DATA TYPE INTEGER,
ALTER COLUMN "id_insumo" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Stock_Almacen_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trabajador" DROP CONSTRAINT "Trabajador_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Unidad_Medida" DROP CONSTRAINT "Unidad_Medida_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ADD CONSTRAINT "Unidad_Medida_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
-- 1. Eliminamos el default anterior
ALTER COLUMN "id" DROP DEFAULT,
-- 2. Cambiamos el tipo de dato a entero normal
ALTER COLUMN "id" SET DATA TYPE INT,
-- 3. Le asignamos la nueva propiedad autoincremental
ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY,
ALTER COLUMN "deleted_by" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

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
