import { Module } from '@nestjs/common';

import { CategoriesModule } from '@/api/categories/categories.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { ExpenseSourcesModule } from '@/api/expense-sources/expense-sources.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [ExpenseSourcesModule, CurrenciesModule, SavedFundsModule, CategoriesModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
