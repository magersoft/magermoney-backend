-- CreateTable
CREATE TABLE "CurrenciesOnUsers" (
    "userId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,

    CONSTRAINT "CurrenciesOnUsers_pkey" PRIMARY KEY ("userId","currencyId")
);

-- AddForeignKey
ALTER TABLE "CurrenciesOnUsers" ADD CONSTRAINT "CurrenciesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrenciesOnUsers" ADD CONSTRAINT "CurrenciesOnUsers_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
