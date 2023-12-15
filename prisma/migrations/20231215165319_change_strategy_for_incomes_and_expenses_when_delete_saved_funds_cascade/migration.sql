-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_savedFundId_fkey";

-- DropForeignKey
ALTER TABLE "Incomes" DROP CONSTRAINT "Incomes_savedFundId_fkey";

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_savedFundId_fkey" FOREIGN KEY ("savedFundId") REFERENCES "SavedFunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_savedFundId_fkey" FOREIGN KEY ("savedFundId") REFERENCES "SavedFunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
