/*
  Warnings:

  - Added the required column `dateAdded` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "dateAdded" TIMESTAMP(3) NOT NULL;
