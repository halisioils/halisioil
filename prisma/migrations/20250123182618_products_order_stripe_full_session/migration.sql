/*
  Warnings:

  - You are about to drop the column `amount_paid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_city` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_country` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_email` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_name` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_state` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_street` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_zipCode` on the `Order` table. All the data in the column will be lost.
  - Added the required column `stripe_Session` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount_paid",
DROP COLUMN "paid",
DROP COLUMN "shipping_city",
DROP COLUMN "shipping_country",
DROP COLUMN "shipping_email",
DROP COLUMN "shipping_name",
DROP COLUMN "shipping_state",
DROP COLUMN "shipping_street",
DROP COLUMN "shipping_zipCode",
ADD COLUMN     "stripe_Session" JSONB NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;
