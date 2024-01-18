/*
  Warnings:

  - You are about to drop the column `title` on the `ExpenseSources` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `IncomeSources` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Incomes` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `ExpenseSources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `IncomeSources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "ExpenseSources" DROP COLUMN "title",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "title",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IncomeSources" DROP COLUMN "title",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "title",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "CategoryType" NOT NULL DEFAULT 'INCOME',
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- AddForeignKey
ALTER TABLE "IncomeSources" ADD CONSTRAINT "IncomeSources_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSources" ADD CONSTRAINT "ExpenseSources_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
