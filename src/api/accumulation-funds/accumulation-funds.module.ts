import { Module } from '@nestjs/common';

import { AccumulationFundsController } from './accumulation-funds.controller';
import { AccumulationFundsService } from './accumulation-funds.service';

@Module({
  imports: [],
  controllers: [AccumulationFundsController],
  providers: [AccumulationFundsService],
})
export class AccumulationFundsModule {}
