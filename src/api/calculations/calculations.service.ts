import { Injectable, NotFoundException } from '@nestjs/common';

import { AccumulationFundsService } from '@/api/accumulation-funds/accumulation-funds.service';
import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { MonthlyBudgetDto } from '@/api/calculations/dto/monthly-budget.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { TotalExpensesDto } from '@/api/calculations/dto/total-expenses.dto';
import { TotalIncomesDto } from '@/api/calculations/dto/total-incomes.dto';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { MonthlyExpensesService } from '@/api/monthly-expenses/monthly-expenses.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
    private readonly savedFundsService: SavedFundsService,
    private readonly monthlyExpensesService: MonthlyExpensesService,
    private readonly accumulationFundsService: AccumulationFundsService,
  ) {}

  public async getTotalBalance(req: RequestContext, currency: string): Promise<TotalBalanceDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const savedFunds = await this.savedFundsService.findAll(req);

    const balance = await savedFunds.reduce(async (acc, savedFund) => {
      if (savedFund.currency.code === currency) {
        return (await acc) + savedFund.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, savedFund.currency.code);
        return (await acc) + savedFund.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    return {
      amount: balance,
      currency,
    };
  }

  public async getTotalIncomes(req: RequestContext, currency: string): Promise<TotalIncomesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const incomeSources = await this.incomeSourcesService.findAll(req);

    const incomeSourcesAmount = await incomeSources.reduce(async (acc, incomeSource) => {
      if (incomeSource.currency.code === currency) {
        return (await acc) + incomeSource.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, incomeSource.currency.code);
        return (await acc) + incomeSource.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    return {
      amount: incomeSourcesAmount,
      currency,
    };
  }

  public async getTotalExpenses(req: RequestContext, currency: string): Promise<TotalExpensesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const monthlyExpenses = await this.monthlyExpensesService.findAll(req);

    if (!monthlyExpenses.length) throw new NotFoundException('Monthly expenses not found');

    const monthlyExpensesAmount = await monthlyExpenses.reduce(async (acc, monthlyExpense) => {
      if (monthlyExpense.currency.code === currency) {
        return (await acc) + monthlyExpense.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(
          currency,
          monthlyExpense.currency.code,
        );
        return (await acc) + monthlyExpense.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    return {
      amount: monthlyExpensesAmount,
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
