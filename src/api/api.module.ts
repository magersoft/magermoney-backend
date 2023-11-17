import { Module } from '@nestjs/common';

import { AuthModule } from '@/api/auth/auth.module';
import { CurrencyModule } from '@/api/currency/currency.module';

import { IncomeSourceModule } from './income-source/income-source.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, IncomeSourceModule, CurrencyModule],
  exports: [AuthModule, UserModule, IncomeSourceModule, CurrencyModule],
})
export class ApiModule {}
