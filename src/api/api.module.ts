import { Module } from '@nestjs/common';

import { AccumulationFundsModule } from './accumulation-funds/accumulation-funds.module';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { ExpenseSourcesModule } from './expense-sources/expense-sources.module';
import { IncomeSourcesModule } from './income-sources/income-sources.module';
import { IncomesModule } from './incomes/incomes.module';
import { SavedFundsModule } from './saved-funds/saved-funds.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    IncomeSourcesModule,
    CurrenciesModule,
    SavedFundsModule,
    AccumulationFundsModule,
    CalculationsModule,
    ExpenseSourcesModule,
    IncomesModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    IncomeSourcesModule,
    CurrenciesModule,
    SavedFundsModule,
    AccumulationFundsModule,
    CalculationsModule,
    ExpenseSourcesModule,
    IncomesModule,
  ],
})
export class ApiModule {}
