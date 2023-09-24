-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OK', 'CANCELLED');

-- AlterTable
ALTER TABLE "CommandOrder" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OK';
