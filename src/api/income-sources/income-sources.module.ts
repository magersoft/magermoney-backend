import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { IncomeSourcesController } from './income-sources.controller';
import { IncomeSourcesService } from './income-sources.service';

@Module({
  imports: [CurrenciesModule],
  controllers: [IncomeSourcesController],
  providers: [IncomeSourcesService],
  exports: [IncomeSourcesService],
})
export class IncomeSourcesModule {}
