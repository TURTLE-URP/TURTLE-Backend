/*
  Warnings:

  - You are about to drop the column `id_medida_insumo` on the `Ingredientes_Plato` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredientes_Plato" DROP CONSTRAINT "Ingredientes_Plato_id_medida_insumo_fkey";

-- AlterTable
ALTER TABLE "Ingredientes_Plato" DROP COLUMN "id_medida_insumo";

-- AlterTable
ALTER TABLE "Platos_Menu" ADD COLUMN     "imagen_url" TEXT;
