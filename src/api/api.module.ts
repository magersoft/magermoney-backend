import { Module } from '@nestjs/common';

import { AccumulationFundsModule } from '@/api/accumulation-funds/accumulation-funds.module';
import { AuthModule } from '@/api/auth/auth.module';
import { CalculationsModule } from '@/api/calculations/calculations.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';
import { UsersModule } from '@/api/users/users.module';

import { MonthlyExpensesModule } from './monthly-expenses/monthly-expenses.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    IncomeSourcesModule,
    CurrenciesModule,
    SavedFundsModule,
    AccumulationFundsModule,
    CalculationsModule,
    MonthlyExpensesModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    IncomeSourcesModule,
    CurrenciesModule,
    SavedFundsModule,
    AccumulationFundsModule,
    CalculationsModule,
    MonthlyExpensesModule,
  ],
})
export class ApiModule {}
