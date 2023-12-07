import { Module } from '@nestjs/common';

import { AccumulationFundsModule } from '@/api/accumulation-funds/accumulation-funds.module';
import { CalculationsController } from '@/api/calculations/calculations.controller';
import { CalculationsService } from '@/api/calculations/calculations.service';
import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';
import { MonthlyExpensesModule } from '@/api/monthly-expenses/monthly-expenses.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

@Module({
  imports: [CurrenciesModule, IncomeSourcesModule, SavedFundsModule, MonthlyExpensesModule, AccumulationFundsModule],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
