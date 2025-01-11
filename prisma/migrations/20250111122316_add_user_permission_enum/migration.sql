-- CreateEnum
CREATE TYPE "UserPermission" AS ENUM ('NORMAL_USER', 'ADMIN_USER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permission" "UserPermission" NOT NULL DEFAULT 'NORMAL_USER';
