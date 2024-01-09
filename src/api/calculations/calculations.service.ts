import { BadRequestException, Injectable } from '@nestjs/common';

import { AccumulationFundsService } from '@/api/accumulation-funds/accumulation-funds.service';
import { QueryTransferDetailsDto } from '@/api/calculations/dto/query-transfer-details.dto';
import { AmountByPercentEntity } from '@/api/calculations/entities/amount-by-percent.entity';
import { MonthlyBudgetEntity } from '@/api/calculations/entities/monthly-budget.entity';
import { PercentByAmountEntity } from '@/api/calculations/entities/percent-by-amount.entity';
import { TotalBalanceEntity } from '@/api/calculations/entities/total-balance.entity';
import { TotalExpenseSourcesEntity } from '@/api/calculations/entities/total-expense-sources.entity';
import { TotalIncomeSourcesEntity } from '@/api/calculations/entities/total-income-source.entity';
import { TotalMonthlyExpensesEntity } from '@/api/calculations/entities/total-monthly-expenses.entity';
import { TotalMonthlyIncomesEntity } from '@/api/calculations/entities/total-monthly-incomes.entity';
import { TransferDetailsEntity } from '@/api/calculations/entities/transfer-details.entity';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { ExpenseSourcesService } from '@/api/expense-sources/expense-sources.service';
import { ExpensesService } from '@/api/expenses/expenses.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { IncomesService } from '@/api/incomes/incomes.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { BEGIN_MONTH, DAYS_IN_MONTH, END_MONTH } from '@/shared/constants';
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

  public async getTotalBalance(req: RequestContext, currency: string): Promise<TotalBalanceEntity> {
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

  public async getTotalIncomeSources(req: RequestContext, currency: string): Promise<TotalIncomeSourcesEntity> {
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

  public async getTotalExpenseSources(req: RequestContext, currency: string): Promise<TotalExpenseSourcesEntity> {
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

  public async getTotalMonthlyIncomes(req: RequestContext, currency: string): Promise<TotalMonthlyIncomesEntity> {
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

  public async getTotalMonthlyExpenses(req: RequestContext, currency: string): Promise<TotalMonthlyExpensesEntity> {
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

  public async getMonthlyBudget(req: RequestContext, currency: string): Promise<MonthlyBudgetEntity> {
    const { amount: totalExpensesAmount } = await this.getTotalMonthlyExpenses(req, currency);
    const { amount: totalIncomesAmount } = await this.getTotalMonthlyIncomes(req, currency);

    const accumulationFunds = await this.accumulationFundsService.findAll(req);

    const accumulationFundPercent = await accumulationFunds.reduce((acc, accumulationFund) => {
      return acc + accumulationFund.percent;
    }, 0);

    const accumulationFundAmount = (totalIncomesAmount / 100) * accumulationFundPercent;
    const budget = totalIncomesAmount - totalExpensesAmount - accumulationFundAmount;
    const restAmount = budget - totalExpensesAmount;
    const restAmountPercentage = (budget / totalIncomesAmount) * 100;
    const availableAmountInDay = restAmount / DAYS_IN_MONTH;

    return {
      budget,
      spent: totalExpensesAmount,
      restAmount,
      restAmountPercentage,
      accumulationFundAmount,
      availableAmountInDay,
      currency,
    };
  }

  public async getPercentByAmount(
    req: RequestContext,
    amount: number,
    currency: string,
  ): Promise<PercentByAmountEntity> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomeSources(req, currency);

    return {
      percent: (amount / incomeSourcesAmount) * 100,
      balance: incomeSourcesAmount - amount,
      amount,
      currency,
    };
  }

  public async getAmountByPercent(
    req: RequestContext,
    percent: number,
    currency: string,
  ): Promise<AmountByPercentEntity> {
    const { amount: incomeSourcesAmount } = await this.getTotalIncomeSources(req, currency);

    const amount = (incomeSourcesAmount / 100) * percent;

    return {
      amount,
      balance: incomeSourcesAmount - amount,
      percent,
      currency,
    };
  }

  public async getTransferDetails(req: RequestContext, query: QueryTransferDetailsDto): Promise<TransferDetailsEntity> {
    const { fromId, toId, amount, currency } = query;
    const { code: currencyCode } = await this.currenciesService.findOne(currency);

    const savedFundFrom = await this.savedFundsService.findOne(req, fromId);
    const savedFundTo = await this.savedFundsService.findOne(req, toId);

    const outcomeExchangeRate = await this.currenciesService.getExchangeRate(savedFundFrom.currency.code, currencyCode);
    const outcomeAmount = amount / outcomeExchangeRate;

    const incomeExchangeRate = await this.currenciesService.getExchangeRate(savedFundTo.currency.code, currencyCode);
    const incomeAmount = amount / incomeExchangeRate;

    if (outcomeAmount > savedFundFrom.amount) throw new BadRequestException('Not enough money');

    return {
      outcome: {
        amount: outcomeAmount,
        currency: savedFundFrom.currency.code,
      },
      income: {
        amount: incomeAmount,
        currency: savedFundTo.currency.code,
      },
      rate: {
        amount: outcomeAmount / incomeAmount,
        currency: savedFundFrom.currency.code,
      },
    };
  }
}
