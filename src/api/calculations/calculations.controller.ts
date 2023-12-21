import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryTransferDetailsDto } from '@/api/calculations/dto/query-transfer-details.dto';
import { AmountByPercentEntity } from '@/api/calculations/entities/amount-by-percent.entity';
import { MonthlyBudgetEntity } from '@/api/calculations/entities/monthly-budget.entity';
import { PercentByAmountEntity } from '@/api/calculations/entities/percent-by-amount.entity';
import { TotalBalanceEntity } from '@/api/calculations/entities/total-balance.entity';
import { TotalMonthlyExpensesEntity } from '@/api/calculations/entities/total-monthly-expenses.entity';
import { TotalMonthlyIncomesEntity } from '@/api/calculations/entities/total-monthly-incomes.entity';
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

  @Get('total-monthly-incomes')
  @ApiOkResponse({ type: TotalMonthlyIncomesEntity })
  getTotalMonthlyIncomes(
    @Request() req: RequestContext,
    @Query('currency') currency: string,
  ): Promise<TotalMonthlyIncomesEntity> {
    return this.calculationsService.getTotalMonthlyIncomes(req, currency);
  }

  @Get('total-monthly-expenses')
  @ApiOkResponse({ type: TotalMonthlyExpensesEntity })
  getTotalMonthlyExpenses(
    @Request() req: RequestContext,
    @Query('currency') currency: string,
  ): Promise<TotalMonthlyExpensesEntity> {
    return this.calculationsService.getTotalMonthlyExpenses(req, currency);
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
}
