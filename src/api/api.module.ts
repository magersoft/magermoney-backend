import { Module } from '@nestjs/common';

import { IncomeSourceModule } from './income-source/income-source.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, IncomeSourceModule],
  exports: [UserModule, IncomeSourceModule],
})
export class ApiModule {}
