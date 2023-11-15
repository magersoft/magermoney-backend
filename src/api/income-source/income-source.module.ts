import { Module } from '@nestjs/common';
import { IncomeSourceService } from './income-source.service';
import { IncomeSourceController } from './income-source.controller';

@Module({
  controllers: [IncomeSourceController],
  providers: [IncomeSourceService],
})
export class IncomeSourceModule {}
