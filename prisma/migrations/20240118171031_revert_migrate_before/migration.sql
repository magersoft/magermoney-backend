/*
  Warnings:

  - You are about to drop the column `categoryId` on the `SavedFunds` table. All the data in the column will be lost.
  - Added the required column `source` to the `SavedFunds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedFunds" DROP CONSTRAINT "SavedFunds_categoryId_fkey";

-- AlterTable
ALTER TABLE "SavedFunds" DROP COLUMN "categoryId",
ADD COLUMN     "source" VARCHAR(100) NOT NULL;
