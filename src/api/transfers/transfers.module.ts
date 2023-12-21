import { Module } from '@nestjs/common';

import { CurrenciesModule } from '@/api/currencies/currencies.module';
import { SavedFundsModule } from '@/api/saved-funds/saved-funds.module';

import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [SavedFundsModule, CurrenciesModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
