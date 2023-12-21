/*
  Warnings:

  - Added the required column `userId` to the `Transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfers" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
