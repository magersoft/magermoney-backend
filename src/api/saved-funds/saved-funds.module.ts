import { Module } from '@nestjs/common';

import { SavedFundsController } from './saved-funds.controller';
import { SavedFundsService } from './saved-funds.service';

@Module({
  controllers: [SavedFundsController],
  providers: [SavedFundsService],
})
export class SavedFundsModule {}
