import { Module } from '@nestjs/common';

import { UsersModule } from '@/api/users/users.module';

import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [UsersModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
