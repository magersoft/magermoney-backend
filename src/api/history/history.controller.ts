import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryHistoryDto } from '@/api/history/dto/query-history.dto';
import { HistoryEntity } from '@/api/history/entities/history.entity';
import { RequestContext } from '@/shared/types';

import { HistoryService } from './history.service';

@Controller('history')
@ApiTags('history')
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOkResponse({ type: HistoryEntity, isArray: true })
  findAll(@Request() req: RequestContext, @Query() query: QueryHistoryDto) {
    return this.historyService.findAll(req, query);
  }
}
