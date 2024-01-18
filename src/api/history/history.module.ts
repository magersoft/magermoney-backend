import { Module } from '@nestjs/common';

import { CategoriesModule } from '@/api/categories/categories.module';
import { UsersModule } from '@/api/users/users.module';

import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [UsersModule, CategoriesModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
