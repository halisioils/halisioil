/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Product` table. All the data in the column will be lost.
  - The `properties` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'ON_HOLD', 'COMING_SOON');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isAvailable",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
DROP COLUMN "properties",
ADD COLUMN     "properties" TEXT[] DEFAULT ARRAY[]::TEXT[];
