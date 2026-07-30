-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "galleries" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "location" TEXT DEFAULT 'Afilas General Hospital';
