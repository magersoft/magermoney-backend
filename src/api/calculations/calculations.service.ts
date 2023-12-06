import { Injectable, NotFoundException } from '@nestjs/common';

import { AmountByPercentDto } from '@/api/calculations/dto/amount-by-percent.dto';
import { PercentByAmountDto } from '@/api/calculations/dto/percent-by-amount.dto';
import { TotalBalanceDto } from '@/api/calculations/dto/total-balance.dto';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
    private readonly savedFundsService: SavedFundsService,
  ) {}

  public async getTotalBalance(req: RequestContext, currency: string): Promise<TotalBalanceDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const savedFunds = await this.savedFundsService.findAll(req);

    if (!savedFunds.length) throw new NotFoundException('Saved funds not found');

    const balance = await savedFunds.reduce(async (acc, savedFund) => {
      if (savedFund.currency.code === currency) {
        return (await acc) + savedFund.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, savedFund.currency.code);
        return (await acc) + savedFund.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    return {
      balance,
      currency,
    };
  }

  public async getPercentByAmount(req: RequestContext, amount: number, currency: string): Promise<PercentByAmountDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const incomeSources = await this.incomeSourcesService.findAll(req);

    if (!incomeSources.length) throw new NotFoundException('Income sources not found');

    const incomeSourcesAmount = await incomeSources.reduce(async (acc, incomeSource) => {
      if (incomeSource.currency.code === currency) {
        return (await acc) + incomeSource.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, incomeSource.currency.code);
        return (await acc) + incomeSource.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    return {
      percent: (amount / incomeSourcesAmount) * 100,
      balance: incomeSourcesAmount - amount,
      amount,
      currency,
    };
  }

  public async getAmountByPercent(req: RequestContext, percent: number, currency: string): Promise<AmountByPercentDto> {
    if (!(await this.currenciesService.validateCurrency(currency))) return;

    const incomeSources = await this.incomeSourcesService.findAll(req);

    if (!incomeSources.length) throw new NotFoundException('Income sources not found');

    const incomeSourcesAmount = await incomeSources.reduce(async (acc, incomeSource) => {
      if (incomeSource.currency.code === currency) {
        return (await acc) + incomeSource.amount;
      } else {
        const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, incomeSource.currency.code);
        return (await acc) + incomeSource.amount / currencyExchangeRate;
      }
    }, Promise.resolve(0));

    const amount = (incomeSourcesAmount / 100) * percent;

    return {
      amount,
      balance: incomeSourcesAmount - amount,
      percent,
      currency,
    };
  }
}
