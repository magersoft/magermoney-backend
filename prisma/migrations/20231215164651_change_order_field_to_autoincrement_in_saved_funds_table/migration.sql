-- AlterTable
CREATE SEQUENCE savedfunds_order_seq;
ALTER TABLE "SavedFunds" ALTER COLUMN "order" SET DEFAULT nextval('savedfunds_order_seq');
ALTER SEQUENCE savedfunds_order_seq OWNED BY "SavedFunds"."order";
