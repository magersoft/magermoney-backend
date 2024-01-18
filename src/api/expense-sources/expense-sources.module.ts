import { Module } from '@nestjs/common';

import { CategoriesModule } from '@/api/categories/categories.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { ExpenseSourcesController } from './expense-sources.controller';
import { ExpenseSourcesService } from './expense-sources.service';

@Module({
  imports: [CurrenciesModule, CategoriesModule],
  controllers: [ExpenseSourcesController],
  providers: [ExpenseSourcesService],
  exports: [ExpenseSourcesService],
})
export class ExpenseSourcesModule {}
