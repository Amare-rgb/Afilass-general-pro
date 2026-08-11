-- CreateEnum
CREATE TYPE "PharmaOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "pharma_orders" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "PharmaOrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharma_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pharma_orders_status_idx" ON "pharma_orders"("status");

-- CreateIndex
CREATE INDEX "pharma_orders_customerEmail_idx" ON "pharma_orders"("customerEmail");

-- CreateIndex
CREATE INDEX "pharma_orders_createdAt_idx" ON "pharma_orders"("createdAt");
