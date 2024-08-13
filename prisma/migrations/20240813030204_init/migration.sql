/*
  Warnings:

  - Added the required column `quantity` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;
