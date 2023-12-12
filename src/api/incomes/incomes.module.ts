import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [IncomeSourcesModule, CurrenciesModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [IncomesService],
})
export class IncomesModule {}
