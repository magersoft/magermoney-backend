import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { RequestContext } from '@/shared/types';

import { CalculationsService } from './calculations.service';

@Controller('calculations')
@ApiTags('calculations')
@ApiBearerAuth()
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('total-balance')
  @ApiOkResponse({ type: TotalBalanceDto })
  getTotalBalance(@Request() req: RequestContext, @Query('currency') currency: string): Promise<TotalBalanceDto> {
    return this.calculationsService.getTotalBalance(req, currency);
  }

  @Get('percent-by-amount')
  @ApiOkResponse({ type: PercentByAmountDto })
  getPercentByAmount(
    @Request() req: RequestContext,
    @Query('value') amount: string,
    @Query('currency') currency: string,
  ): Promise<PercentByAmountDto> {
    return this.calculationsService.getPercentByAmount(req, +amount, currency);
  }

  @Get('amount-by-percent')
  @ApiOkResponse({ type: AmountByPercentDto })
  getAmountByPercent(
    @Request() req: RequestContext,
    @Query('value') percent: string,
    @Query('currency') currency: string,
  ): Promise<AmountByPercentDto> {
    return this.calculationsService.getAmountByPercent(req, +percent, currency);
  }
}
