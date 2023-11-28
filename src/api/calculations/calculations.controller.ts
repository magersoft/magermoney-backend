import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestContext } from '@/shared/types';

import { CalculationsService } from './calculations.service';

@Controller('calculations')
@ApiTags('calculations')
@ApiBearerAuth()
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('percent-by-amount')
  getPercentByAmount(
    @Request() req: RequestContext,
    @Query('value') amount: string,
    @Query('currency') currency: string,
  ) {
    return this.calculationsService.getPercentByAmount(req, +amount, currency);
  }

  @Get('amount-by-percent')
  getAmountByPercent(
    @Request() req: RequestContext,
    @Query('value') percent: string,
    @Query('currency') currency: string,
  ) {
    return this.calculationsService.getAmountByPercent(req, +percent, currency);
  }
}
