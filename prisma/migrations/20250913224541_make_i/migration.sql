/*
  Warnings:

  - Made the column `brand` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "brand" SET NOT NULL;
