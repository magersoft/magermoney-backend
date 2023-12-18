-- AlterTable
ALTER TABLE "SavedFunds" ALTER COLUMN "order" SET DEFAULT -1,
ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "savedfunds_order_seq";
