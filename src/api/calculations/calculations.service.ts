import { Injectable } from '@nestjs/common';

import { AccumulationFundsService } from '@/api/accumulation-funds/accumulation-funds.service';
import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { MonthlyBudgetDto } from '@/api/calculations/dto/monthly-budget.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { TotalExpenseSourcesDto } from '@/api/calculations/dto/total-expense-sources.dto';
import { TotalIncomeSourcesDto } from '@/api/calculations/dto/total-income-sources.dto';
import { TotalMonthlyExpensesDto } from '@/api/calculations/dto/total-monthly-expenses.dto';
import { TotalMonthlyIncomesDto } from '@/api/calculations/dto/total-monthly-incomes.dto';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { ExpenseSourcesService } from '@/api/expense-sources/expense-sources.service';
import { ExpensesService } from '@/api/expenses/expenses.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { IncomesService } from '@/api/incomes/incomes.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { BEGIN_MONTH, END_MONTH } from '@/shared/constants';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
    private readonly savedFundsService: SavedFundsService,
    private readonly expenseSourcesService: ExpenseSourcesService,
    private readonly accumulationFundsService: AccumulationFundsService,
    private readonly incomesService: IncomesService,
    private readonly expensesService: ExpensesService,
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

  public async getTotalIncomeSources(req: RequestContext, currency: string): Promise<TotalIncomeSourcesDto> {
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

  public async getTotalExpenseSources(req: RequestContext, currency: string): Promise<TotalExpenseSourcesDto> {
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

  public async getTotalMonthlyIncomes(req: RequestContext, currency: string): Promise<TotalMonthlyIncomesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const incomes = await this.incomesService.findAllByPeriod(req, BEGIN_MONTH, END_MONTH);

    let amount = 0;

    for (const income of incomes) {
      if (income.currency.code === currency) {
        amount += income.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getExchangeRate(currency, income.currency.code);
        amount += income.amount / currencyExchangeRate;
      }
    }

    return {
      amount,
      currency,
    };
  }

  public async getTotalMonthlyExpenses(req: RequestContext, currency: string): Promise<TotalMonthlyExpensesDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const expenses = await this.expensesService.findAllByPeriod(req, BEGIN_MONTH, END_MONTH);

    let amount = 0;

    for (const expense of expenses) {
      if (expense.currency.code === currency) {
        amount += expense.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getExchangeRate(currency, expense.currency.code);
        amount += expense.amount / currencyExchangeRate;
      }
    }

    return {
      amount,
      currency,
    };
  }

  public async getMonthlyBudget(req: RequestContext, currency: string): Promise<MonthlyBudgetDto> {
    const { amount: totalExpensesAmount } = await this.getTotalMonthlyExpenses(req, currency);
    const { amount: totalIncomesAmount } = await this.getTotalMonthlyIncomes(req, currency);

    const accumulationFunds = await this.accumulationFundsService.findAll(req);

    const accumulationFundPercent = await accumulationFunds.reduce((acc, accumulationFund) => {
      return acc + accumulationFund.percent;
    }, 0);

    const accumulationFundAmount = (totalIncomesAmount / 100) * accumulationFundPercent;

    const budget = totalIncomesAmount - totalExpensesAmount - accumulationFundAmount;

    return {
      budget,
      spent: totalExpensesAmount,
      restAmount: budget - totalExpensesAmount,
      restAmountPercentage: (budget / totalIncomesAmount) * 100,
      currency,
    };
  }

  public async getPercentByAmount(req: RequestContext, amount: number, currency: string): Promise<PercentByAmountDto> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomeSources(req, currency);

    return {
      percent: (amount / incomeSourcesAmount) * 100,
      balance: incomeSourcesAmount - amount,
      amount,
      currency,
    };
  }

  public async getAmountByPercent(req: RequestContext, percent: number, currency: string): Promise<AmountByPercentDto> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomeSources(req, currency);

    const amount = (incomeSourcesAmount / 100) * percent;

    return {
      amount,
      balance: incomeSourcesAmount - amount,
      percent,
      currency,
    };
  }
}
