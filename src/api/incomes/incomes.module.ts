import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [IncomeSourcesModule, CurrenciesModule, SavedFundsModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [IncomesService],
})
export class IncomesModule {}
