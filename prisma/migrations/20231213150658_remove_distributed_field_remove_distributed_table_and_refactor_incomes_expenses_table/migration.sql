/*
  Warnings:

  - You are about to drop the column `distributed` on the `Incomes` table. All the data in the column will be lost.
  - You are about to drop the `DistributedFunds` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `savedFundId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savedFundId` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DistributedFunds" DROP CONSTRAINT "DistributedFunds_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "DistributedFunds" DROP CONSTRAINT "DistributedFunds_incomeId_fkey";

-- DropForeignKey
ALTER TABLE "DistributedFunds" DROP CONSTRAINT "DistributedFunds_savedFundId_fkey";

-- DropForeignKey
ALTER TABLE "DistributedFunds" DROP CONSTRAINT "DistributedFunds_userId_fkey";

-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "expenseSourceId" INTEGER,
ADD COLUMN     "savedFundId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "distributed",
ADD COLUMN     "incomeSourceId" INTEGER,
ADD COLUMN     "savedFundId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "DistributedFunds";

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_savedFundId_fkey" FOREIGN KEY ("savedFundId") REFERENCES "SavedFunds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_incomeSourceId_fkey" FOREIGN KEY ("incomeSourceId") REFERENCES "IncomeSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_savedFundId_fkey" FOREIGN KEY ("savedFundId") REFERENCES "SavedFunds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_expenseSourceId_fkey" FOREIGN KEY ("expenseSourceId") REFERENCES "ExpenseSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
