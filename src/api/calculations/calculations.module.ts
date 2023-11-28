import { Module } from '@nestjs/common';

import { CalculationsController } from '@/api/calculations/calculations.controller';
import { CalculationsService } from '@/api/calculations/calculations.service';
import { IncomeSourcesModule } from '@/api/income-sources/income-sources.module';

@Module({
  imports: [IncomeSourcesModule],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
