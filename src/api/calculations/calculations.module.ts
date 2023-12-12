import { Module } from '@nestjs/common';

import { AccumulationFundsModule } from '@/api/accumulation-funds/accumulation-funds.module';
import { CalculationsController } from '@/api/calculations/calculations.controller';
import { CalculationsService } from '@/api/calculations/calculations.service';
import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { ExpenseSourcesModule } from '@/api/expense-sources/expense-sources.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';
import { IncomesModule } from '@/api/incomes/incomes.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

@Module({
  imports: [
    CurrenciesModule,
    IncomeSourcesModule,
    ExpenseSourcesModule,
    SavedFundsModule,
    AccumulationFundsModule,
    IncomesModule,
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
