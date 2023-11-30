/*
  Warnings:

  - You are about to drop the column `currency` on the `IncomeSource` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `MonthlyExpense` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `SavedFunds` table. All the data in the column will be lost.
  - Made the column `userId` on table `AccumulationFunds` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currencyId` to the `IncomeSource` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `IncomeSource` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currencyId` to the `MonthlyExpense` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `MonthlyExpense` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Purchase` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currencyId` to the `SavedFunds` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `SavedFunds` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AccumulationFunds" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "IncomeSource" DROP COLUMN "currency",
ADD COLUMN     "currencyId" INTEGER NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyExpense" DROP COLUMN "currency",
ADD COLUMN     "currencyId" INTEGER NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SavedFunds" DROP COLUMN "currency",
ADD COLUMN     "currencyId" INTEGER NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "IncomeSource" ADD CONSTRAINT "IncomeSource_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFunds" ADD CONSTRAINT "SavedFunds_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyExpense" ADD CONSTRAINT "MonthlyExpense_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
