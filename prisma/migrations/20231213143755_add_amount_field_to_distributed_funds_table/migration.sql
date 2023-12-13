/*
  Warnings:

  - Added the required column `amount` to the `DistributedFunds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DistributedFunds" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
