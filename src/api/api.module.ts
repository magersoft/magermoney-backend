import { Module } from '@nestjs/common';

import { AccumulationFundsModule } from './accumulation-funds/accumulation-funds.module';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';
import { CategoriesModule } from './categories/categories.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { ExpenseSourcesModule } from './expense-sources/expense-sources.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HistoryModule } from './history/history.module';
import { IncomeSourcesModule } from './income-sources/income-sources.module';
import { IncomesModule } from './incomes/incomes.module';
import { SavedFundsModule } from './saved-funds/saved-funds.module';
import { TransfersModule } from './transfers/transfers.module';
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
    ExpensesModule,
    TransfersModule,
    HistoryModule,
    CategoriesModule,
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
    ExpensesModule,
    CategoriesModule,
  ],
})
export class ApiModule {}
