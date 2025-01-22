/*
  Warnings:

  - You are about to drop the column `city` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pricePaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `ProductOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOrder" DROP CONSTRAINT "ProductOrder_productId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProducts" DROP CONSTRAINT "_OrderProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProducts" DROP CONSTRAINT "_OrderProducts_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "pricePaid",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zipCode",
ADD COLUMN     "amount_paid" DECIMAL(65,30),
ADD COLUMN     "shipping_city" TEXT,
ADD COLUMN     "shipping_country" TEXT,
ADD COLUMN     "shipping_email" TEXT,
ADD COLUMN     "shipping_name" TEXT,
ADD COLUMN     "shipping_state" TEXT,
ADD COLUMN     "shipping_street" TEXT,
ADD COLUMN     "shipping_zipCode" TEXT;

-- DropTable
DROP TABLE "ProductOrder";

-- DropTable
DROP TABLE "_OrderProducts";

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
