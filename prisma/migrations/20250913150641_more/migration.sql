-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "efficiency" DOUBLE PRECISION,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOffGrid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPortable" BOOLEAN NOT NULL DEFAULT false;
