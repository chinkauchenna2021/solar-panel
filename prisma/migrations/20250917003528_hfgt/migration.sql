-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "processingAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3);
