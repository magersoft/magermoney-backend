import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { ExpenseSourcesController } from './expense-sources.controller';
import { ExpenseSourcesService } from './expense-sources.service';

@Module({
  imports: [CurrenciesModule],
  controllers: [ExpenseSourcesController],
  providers: [ExpenseSourcesService],
  exports: [ExpenseSourcesService],
})
export class ExpenseSourcesModule {}
