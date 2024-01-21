import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QuerySummaryExpensesByCategoriesDto } from '@/api/calculations/dto/query-summary-expenses-by-categories.dto';
import { QuerySummaryIncomesByCategoriesDto } from '@/api/calculations/dto/query-summary-incomes-by-categories.dto';
import { QueryTotalExpensesDto } from '@/api/calculations/dto/query-total-expenses.dto';
import { QueryTotalIncomesDto } from '@/api/calculations/dto/query-total-incomes.dto';
import { QueryTransferDetailsDto } from '@/api/calculations/dto/query-transfer-details.dto';
import { AmountByPercentEntity } from '@/api/calculations/entities/amount-by-percent.entity';
import { MonthlyBudgetEntity } from '@/api/calculations/entities/monthly-budget.entity';
import { PercentByAmountEntity } from '@/api/calculations/entities/percent-by-amount.entity';
import { SummaryExpensesByCategoriesEntity } from '@/api/calculations/entities/summary-expenses-by-categories.entity';
import { SummaryIncomesByCategoriesEntity } from '@/api/calculations/entities/summary-incomes-by-categories.entity';
import { TotalBalanceEntity } from '@/api/calculations/entities/total-balance.entity';
import { TotalExpensesEntity } from '@/api/calculations/entities/total-expenses.entity';
import { TotalIncomesEntity } from '@/api/calculations/entities/total-incomes.entity';
import { TransferDetailsEntity } from '@/api/calculations/entities/transfer-details.entity';
import { RequestContext } from '@/shared/types';

import { CalculationsService } from './calculations.service';

@Controller('calculations')
@ApiTags('calculations')
@ApiBearerAuth()
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('total-balance')
  @ApiOkResponse({ type: TotalBalanceEntity })
  getTotalBalance(@Request() req: RequestContext, @Query('currency') currency: string): Promise<TotalBalanceEntity> {
    return this.calculationsService.getTotalBalance(req, currency);
  }

  @Get('total-incomes')
  @ApiOkResponse({ type: TotalIncomesEntity })
  getTotalIncomes(@Request() req: RequestContext, @Query() query: QueryTotalIncomesDto): Promise<TotalIncomesEntity> {
    return this.calculationsService.getTotalIncomes(req, query);
  }

  @Get('total-expenses')
  @ApiOkResponse({ type: TotalExpensesEntity })
  getTotalExpenses(
    @Request() req: RequestContext,
    @Query() query: QueryTotalExpensesDto,
  ): Promise<TotalExpensesEntity> {
    return this.calculationsService.getTotalExpenses(req, query);
  }

  @Get('monthly-budget')
  @ApiOkResponse({ type: MonthlyBudgetEntity })
  getMonthlyBudget(@Request() req: RequestContext, @Query('currency') currency: string): Promise<MonthlyBudgetEntity> {
    return this.calculationsService.getMonthlyBudget(req, currency);
  }

  @Get('percent-by-amount')
  @ApiOkResponse({ type: PercentByAmountEntity })
  getPercentByAmount(
    @Request() req: RequestContext,
    @Query('value') amount: string,
    @Query('currency') currency: string,
  ): Promise<PercentByAmountEntity> {
    return this.calculationsService.getPercentByAmount(req, +amount, currency);
  }

  @Get('amount-by-percent')
  @ApiOkResponse({ type: AmountByPercentEntity })
  getAmountByPercent(
    @Request() req: RequestContext,
    @Query('value') percent: string,
    @Query('currency') currency: string,
  ): Promise<AmountByPercentEntity> {
    return this.calculationsService.getAmountByPercent(req, +percent, currency);
  }

  @Get('get-transfer-details')
  @ApiOkResponse({ type: TransferDetailsEntity })
  getTransferDetails(
    @Request() req: RequestContext,
    @Query() query: QueryTransferDetailsDto,
  ): Promise<TransferDetailsEntity> {
    return this.calculationsService.getTransferDetails(req, query);
  }

  @Get('get-summary-incomes-by-categories')
  @ApiOkResponse({ type: SummaryIncomesByCategoriesEntity, isArray: true })
  getSummaryIncomesByCategories(
    @Request() req: RequestContext,
    @Query() query: QuerySummaryIncomesByCategoriesDto,
  ): Promise<SummaryIncomesByCategoriesEntity[]> {
    return this.calculationsService.getSummaryIncomesByCategories(req, query);
  }

  @Get('get-summary-expenses-by-categories')
  @ApiOkResponse({ type: SummaryExpensesByCategoriesEntity, isArray: true })
  getSummaryExpensesByCategories(
    @Request() req: RequestContext,
    @Query() query: QuerySummaryExpensesByCategoriesDto,
  ): Promise<SummaryExpensesByCategoriesEntity[]> {
    return this.calculationsService.getSummaryExpensesByCategories(req, query);
  }
}
