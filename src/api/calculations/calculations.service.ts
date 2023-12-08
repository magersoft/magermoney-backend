import { Injectable, NotFoundException } from '@nestjs/common';

import { AccumulationFundsService } from '@/api/accumulation-funds/accumulation-funds.service';
import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { MonthlyBudgetDto } from '@/api/calculations/dto/monthly-budget.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { TotalExpensesDto } from '@/api/calculations/dto/total-expenses.dto';
import { TotalIncomesDto } from '@/api/calculations/dto/total-incomes.dto';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { ExpenseSourcesService } from '@/api/expense-sources/expense-sources.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
    private readonly savedFundsService: SavedFundsService,
    private readonly expenseSourcesService: ExpenseSourcesService,
    private readonly accumulationFundsService: AccumulationFundsService,
  ) {}

  public async getTotalBalance(req: RequestContext, currency: string): Promise<TotalBalanceDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const savedFunds = await this.savedFundsService.findAll(req);

    let amount = 0;

    for (const savedFund of savedFunds) {
      if (savedFund.currency.code === currency) {
        amount += savedFund.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getExchangeRate(currency, savedFund.currency.code);
        amount += savedFund.amount / currencyExchangeRate;
      }
    }

    return {
      amount,
      currency,
    };
  }

  public async getTotalIncomes(req: RequestContext, currency: string): Promise<TotalIncomesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const incomeSources = await this.incomeSourcesService.findAll(req);

    let amount = 0;

    for (const incomeSource of incomeSources) {
      if (incomeSource.currency.code === currency) {
        amount += incomeSource.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getExchangeRate(currency, incomeSource.currency.code);
        amount += incomeSource.amount / currencyExchangeRate;
      }
    }

    return {
      amount,
      currency,
    };
  }

  public async getTotalExpenses(req: RequestContext, currency: string): Promise<TotalExpensesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const expenseSources = await this.expenseSourcesService.findAll(req);

    let amount = 0;

    for (const expenseSource of expenseSources) {
      if (expenseSource.currency.code === currency) {
        amount += expenseSource.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getExchangeRate(
          currency,
          expenseSource.currency.code,
        );
        amount += expenseSource.amount / currencyExchangeRate;
      }
    }

    return {
      amount,
      currency,
    };
  }

  public async getMonthlyBudget(req: RequestContext, currency: string): Promise<MonthlyBudgetDto> {
    const { amount: totalExpensesAmount } = await this.getTotalExpenses(req, currency);
    const { amount: totalIncomesAmount } = await this.getTotalIncomes(req, currency);

    const accumulationFunds = await this.accumulationFundsService.findAll(req);

    const accumulationFundPercent = await accumulationFunds.reduce((acc, accumulationFund) => {
      return acc + accumulationFund.percent;
    }, 0);

    const accumulationFundAmount = (totalIncomesAmount / 100) * accumulationFundPercent;

    const budget = totalIncomesAmount - totalExpensesAmount - accumulationFundAmount;

    return {
      budget,
      spent: 0,
      restAmount: budget, // @todo вычислить остаток из расходов
      restAmountPercentage: (budget / totalIncomesAmount) * 100,
      currency,
    };
  }

  public async getPercentByAmount(req: RequestContext, amount: number, currency: string): Promise<PercentByAmountDto> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomes(req, currency);

    return {
      percent: (amount / incomeSourcesAmount) * 100,
      balance: incomeSourcesAmount - amount,
      amount,
      currency,
    };
  }

  public async getAmountByPercent(req: RequestContext, percent: number, currency: string): Promise<AmountByPercentDto> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomes(req, currency);

    const amount = (incomeSourcesAmount / 100) * percent;

    return {
      amount,
      balance: incomeSourcesAmount - amount,
      percent,
      currency,
    };
  }
}
