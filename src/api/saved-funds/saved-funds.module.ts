import { Module } from '@nestjs/common';

import { CategoriesModule } from '@/api/categories/categories.module';
import { CurrenciesModule } from '@/api/currencies/currencies.module';

import { SavedFundsController } from './saved-funds.controller';
import { SavedFundsService } from './saved-funds.service';

@Module({
  imports: [CurrenciesModule, CategoriesModule],
  controllers: [SavedFundsController],
  providers: [SavedFundsService],
  exports: [SavedFundsService],
})
export class SavedFundsModule {}
