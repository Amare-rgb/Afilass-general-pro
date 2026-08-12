/*
  Warnings:

  - You are about to drop the column `doctorId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the `pharma_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "working_hours" DROP CONSTRAINT "working_hours_doctorId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "doctorId";

-- DropTable
DROP TABLE "pharma_orders";

-- DropEnum
DROP TYPE "PharmaOrderStatus";

-- AddForeignKey
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
