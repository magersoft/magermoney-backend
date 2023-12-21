-- CreateTable
CREATE TABLE "Transfers" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "toId" INTEGER NOT NULL,
    "fromId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transfers_toId_fromId_idx" ON "Transfers"("toId", "fromId");

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_toId_fkey" FOREIGN KEY ("toId") REFERENCES "SavedFunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "SavedFunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
