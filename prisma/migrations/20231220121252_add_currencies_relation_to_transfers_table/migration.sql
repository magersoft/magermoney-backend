/*
  Warnings:

  - Added the required column `currencyId` to the `Transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfers" ADD COLUMN     "currencyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
