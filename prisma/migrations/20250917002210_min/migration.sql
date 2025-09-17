-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shipping" DECIMAL(10,2),
ADD COLUMN     "subtotal" DECIMAL(10,2),
ADD COLUMN     "tax" DECIMAL(10,2);
