/*
  Warnings:

  - You are about to drop the column `stock_ideal` on the `Insumo` table. All the data in the column will be lost.
  - You are about to drop the column `stock_min` on the `Insumo` table. All the data in the column will be lost.
  - Added the required column `stock_ideal` to the `Stock_Almacen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_min` to the `Stock_Almacen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "unidad_tipo" ADD VALUE 'unidad';

-- AlterTable
ALTER TABLE "Insumo" DROP COLUMN "stock_ideal",
DROP COLUMN "stock_min";

-- AlterTable
ALTER TABLE "Stock_Almacen" ADD COLUMN     "stock_ideal" DECIMAL NOT NULL,
ADD COLUMN     "stock_min" DECIMAL NOT NULL;
