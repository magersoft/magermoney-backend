import { Module } from '@nestjs/common';

import { AuthModule } from '@/api/auth/auth.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { AccumulatedFundsModule } from './accumulated-funds/accumulated-funds.module';
import { IncomeSourcesModule } from './income-sources/income-sources.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, IncomeSourcesModule, CurrenciesModule, AccumulatedFundsModule],
  exports: [AuthModule, UsersModule, IncomeSourcesModule, CurrenciesModule, AccumulatedFundsModule],
})
export class ApiModule {}
