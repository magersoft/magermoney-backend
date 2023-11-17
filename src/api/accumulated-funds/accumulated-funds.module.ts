import { Module } from '@nestjs/common';
import { AccumulatedFundsService } from './accumulated-funds.service';
import { AccumulatedFundsController } from './accumulated-funds.controller';

@Module({
  controllers: [AccumulatedFundsController],
  providers: [AccumulatedFundsService],
})
export class AccumulatedFundsModule {}
