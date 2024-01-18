/*
  Warnings:

  - You are about to drop the column `source` on the `SavedFunds` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `SavedFunds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'SAVED';

-- AlterTable
ALTER TABLE "SavedFunds" DROP COLUMN "source",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SavedFunds" ADD CONSTRAINT "SavedFunds_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
