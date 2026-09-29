/*
  Warnings:

  - You are about to drop the column `stock_ideal` on the `Stock_Almacen` table. All the data in the column will be lost.
  - You are about to drop the column `stock_min` on the `Stock_Almacen` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "medida_uso" AS ENUM ('todo', 'receta', 'productos_proveedor');

-- AlterTable
ALTER TABLE "Insumo_Medidas" ADD COLUMN     "uso" "medida_uso";

-- AlterTable
ALTER TABLE "Stock_Almacen" DROP COLUMN "stock_ideal",
DROP COLUMN "stock_min";

-- CreateTable
CREATE TABLE "Alerta_Global" (
    "id" SERIAL NOT NULL,
    "id_insumo" INTEGER NOT NULL,
    "stock_min" DECIMAL NOT NULL,
    "stock_deseado" DECIMAL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "Alerta_Global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta_Almacen" (
    "id" SERIAL NOT NULL,
    "id_insumo" INTEGER NOT NULL,
    "id_almacen" INTEGER NOT NULL,
    "minimo_alerta" DECIMAL NOT NULL,
    "cantidad_reponer" DECIMAL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "Alerta_Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alerta_Global_id_insumo_key" ON "Alerta_Global"("id_insumo");

-- CreateIndex
CREATE UNIQUE INDEX "Alerta_Almacen_id_insumo_id_almacen_key" ON "Alerta_Almacen"("id_insumo", "id_almacen");

-- AddForeignKey
ALTER TABLE "Alerta_Global" ADD CONSTRAINT "Alerta_Global_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta_Almacen" ADD CONSTRAINT "Alerta_Almacen_id_insumo_fkey" FOREIGN KEY ("id_insumo") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta_Almacen" ADD CONSTRAINT "Alerta_Almacen_id_almacen_fkey" FOREIGN KEY ("id_almacen") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
