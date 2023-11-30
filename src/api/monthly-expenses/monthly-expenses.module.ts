import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { MonthlyExpensesController } from './monthly-expenses.controller';
import { MonthlyExpensesService } from './monthly-expenses.service';

@Module({
  imports: [CurrenciesModule],
  controllers: [MonthlyExpensesController],
  providers: [MonthlyExpensesService],
})
export class MonthlyExpensesModule {}
