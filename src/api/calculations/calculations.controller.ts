import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { MonthlyBudgetDto } from '@/api/calculations/dto/monthly-budget.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { TotalMonthlyExpensesDto } from '@/api/calculations/dto/total-monthly-expenses.dto';
import { TotalMonthlyIncomesDto } from '@/api/calculations/dto/total-monthly-incomes.dto';
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

  @Get('total-monthly-incomes')
  @ApiOkResponse({ type: TotalMonthlyIncomesDto })
  getTotalMonthlyIncomes(
    @Request() req: RequestContext,
    @Query('currency') currency: string,
  ): Promise<TotalMonthlyIncomesDto> {
    return this.calculationsService.getTotalMonthlyIncomes(req, currency);
  }

  @Get('total-monthly-expenses')
  @ApiOkResponse({ type: TotalMonthlyExpensesDto })
  getTotalMonthlyExpenses(
    @Request() req: RequestContext,
    @Query('currency') currency: string,
  ): Promise<TotalMonthlyExpensesDto> {
    return this.calculationsService.getTotalMonthlyExpenses(req, currency);
  }

  @Get('monthly-budget')
  @ApiOkResponse({ type: MonthlyBudgetDto })
  getMonthlyBudget(@Request() req: RequestContext, @Query('currency') currency: string): Promise<MonthlyBudgetDto> {
    return this.calculationsService.getMonthlyBudget(req, currency);
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
