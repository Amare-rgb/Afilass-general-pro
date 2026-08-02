/*
  Warnings:

  - You are about to drop the column `departmentId` on the `doctors` table. All the data in the column will be lost.
  - The `tags` column on the `news` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_departmentId_fkey";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "departmentId";

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "videoUrl" TEXT,
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
