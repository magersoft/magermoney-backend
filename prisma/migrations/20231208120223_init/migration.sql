-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "authCode" VARCHAR(6),
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "language" VARCHAR(10) NOT NULL DEFAULT 'ru-RU',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RUB',
    "isFirstTime" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeSources" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseSources" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incomes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "distributed" BOOLEAN NOT NULL DEFAULT false,
    "dateOfIssue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dateOfIssue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFunds" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributedFunds" (
    "id" SERIAL NOT NULL,
    "incomeId" INTEGER,
    "expenseId" INTEGER,
    "savedFundId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DistributedFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccumulationFunds" (
    "id" SERIAL NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AccumulationFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currencies" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,

    CONSTRAINT "Currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRates" (
    "id" SERIAL NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "toId" INTEGER NOT NULL,
    "fromId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Currencies_code_key" ON "Currencies"("code");

-- CreateIndex
CREATE INDEX "Currencies_code_idx" ON "Currencies"("code");

-- CreateIndex
CREATE INDEX "ExchangeRates_toId_fromId_idx" ON "ExchangeRates"("toId", "fromId");

-- AddForeignKey
ALTER TABLE "IncomeSources" ADD CONSTRAINT "IncomeSources_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeSources" ADD CONSTRAINT "IncomeSources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSources" ADD CONSTRAINT "ExpenseSources_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSources" ADD CONSTRAINT "ExpenseSources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFunds" ADD CONSTRAINT "SavedFunds_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFunds" ADD CONSTRAINT "SavedFunds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedFunds" ADD CONSTRAINT "DistributedFunds_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "Incomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedFunds" ADD CONSTRAINT "DistributedFunds_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedFunds" ADD CONSTRAINT "DistributedFunds_savedFundId_fkey" FOREIGN KEY ("savedFundId") REFERENCES "SavedFunds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedFunds" ADD CONSTRAINT "DistributedFunds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccumulationFunds" ADD CONSTRAINT "AccumulationFunds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRates" ADD CONSTRAINT "ExchangeRates_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRates" ADD CONSTRAINT "ExchangeRates_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
