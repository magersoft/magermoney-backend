import { Module } from '@nestjs/common';

import { CategoriesModule } from '@/api/categories/categories.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [IncomeSourcesModule, CurrenciesModule, SavedFundsModule, CategoriesModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [IncomesService],
})
export class IncomesModule {}
