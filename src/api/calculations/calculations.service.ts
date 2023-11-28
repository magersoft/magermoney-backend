import { Injectable, NotFoundException } from '@nestjs/common';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
  ) {}

  public async getPercentByAmount(req: RequestContext, amount: number, currency: string) {
    if (await this.currenciesService.validateCurrency(currency)) {
      const incomeSources = await this.incomeSourcesService.findAll(req);

      if (!incomeSources.length) throw new NotFoundException('Income sources not found');

      const incomeSourcesAmount = await incomeSources.reduce(async (acc, incomeSource) => {
        if (incomeSource.currency === currency) {
          return (await acc) + incomeSource.amount;
        } else {
          const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, incomeSource.currency);
          return (await acc) + incomeSource.amount / currencyExchangeRate;
        }
      }, Promise.resolve(0));

      return (amount / incomeSourcesAmount) * 100;
    }
  }

  public async getAmountByPercent(req: RequestContext, percent: number, currency: string) {
    if (await this.currenciesService.validateCurrency(currency)) {
      const incomeSources = await this.incomeSourcesService.findAll(req);

      if (!incomeSources.length) throw new NotFoundException('Income sources not found');

      const incomeSourcesAmount = await incomeSources.reduce(async (acc, incomeSource) => {
        if (incomeSource.currency === currency) {
          return (await acc) + incomeSource.amount;
        } else {
          const currencyExchangeRate = await this.currenciesService.getCurrencyRate(currency, incomeSource.currency);
          return (await acc) + incomeSource.amount / currencyExchangeRate;
        }
      }, Promise.resolve(0));

      return (incomeSourcesAmount / 100) * percent;
    }
  }
}
