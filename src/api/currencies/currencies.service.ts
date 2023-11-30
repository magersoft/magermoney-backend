import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { PrismaService } from 'nestjs-prisma';
import { catchError, firstValueFrom } from 'rxjs';

import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { mocksCurrenciesApiData } from '@/api/currencies/mocks/mocksCurrencies';
import { mapCurrencies } from '@/api/currencies/utils/mapCurrencies';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);
  private isDev: boolean = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');

    this.fetchCurrencies();
  }

  public async findAll(): Promise<CurrencyEntity[]> {
    await this.fetchCurrencies();
    return await this.prisma.currency.findMany();
  }

  public async findOne(code: string): Promise<CurrencyEntity> {
    await this.fetchCurrencies();
    return await this.prisma.currency.findUniqueOrThrow({
      where: {
        code,
      },
    });
  }

  public async getCurrencyRate(from: string, to: string) {
    const fromCurrency = await this.findOne(from);
    const toCurrency = await this.findOne(to);

    const currencyRate = await this.prisma.currencyRate.findFirst({
      where: {
        fromId: fromCurrency.id,
        toId: toCurrency.id,
      },
    });

    if (!currencyRate) {
      const rate = await this.fetchCurrencyExchangeRate(from, to);

      await this.prisma.currencyRate.create({
        data: {
          fromId: fromCurrency.id,
          toId: toCurrency.id,
          rate,
        },
      });

      return rate;
    }

    if (currencyRate.updatedAt.getTime() + Number(this.configService.get<number>('currencies.rateTTL')) < Date.now()) {
      const rate = await this.fetchCurrencyExchangeRate(from, to);

      await this.prisma.currencyRate.update({
        where: {
          id: currencyRate.id,
        },
        data: {
          rate,
        },
      });

      return rate;
    }

    return currencyRate.rate;
  }

  public async validateCurrency(currency: string) {
    const currencies = await this.findAll();
    const currencyExists = currencies.find((c) => c.code === currency);
    if (!currencyExists) {
      throw new Error(`Currency ${currency} does not exist`);
    }

    return true;
  }

  private async fetchCurrencyExchangeRate(from: string, to: string): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(this.configService.get<string>('currencies.ratesEndpoint'), {
          params: {
            base_currency: from,
            currencies: to,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new InternalServerErrorException();
          }),
        ),
    );

    return data.data[to];
  }

  private async fetchCurrencies(): Promise<void> {
    let currencies: Omit<CurrencyEntity, 'id'>[];

    const countCurrencies = await this.prisma.currency.count();
    if (countCurrencies) return;

    this.logger.warn('Currencies were not found in database, fetching...');

    if (this.isDev) {
      currencies = await new Promise((resolve) =>
        setTimeout(() => resolve(mapCurrencies(mocksCurrenciesApiData)), this.configService.get<number>('mocksDelay')),
      );
    } else {
      const { data } = await firstValueFrom(
        this.httpService.get(this.configService.get<string>('currencies.currenciesEndpoint')).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new InternalServerErrorException();
          }),
        ),
      );

      currencies = mapCurrencies(data);
    }

    const { count } = await this.prisma.currency.createMany({
      data: currencies,
      skipDuplicates: true,
    });

    this.logger.log(`Currencies were fetched and "${count}" entity were saved in database`);
  }
}
