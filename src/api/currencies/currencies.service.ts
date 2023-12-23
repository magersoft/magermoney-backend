import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { PrismaService } from 'nestjs-prisma';
import { catchError, firstValueFrom } from 'rxjs';

import { CreateAllByUserDto } from '@/api/currencies/dto/create-all-by-user.dto';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { CurrencyRateEntity } from '@/api/currencies/entities/currency-rate.entity';
import { mocksCurrenciesApiData } from '@/api/currencies/mocks/mocksCurrencies';
import { mapCurrencies } from '@/api/currencies/utils/mapCurrencies';
import { RequestContext } from '@/shared/types';

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

  public async findAll(force = false): Promise<CurrencyEntity[]> {
    await this.fetchCurrencies(force);
    return await this.prisma.currencies.findMany();
  }

  public async findAllByUser(req: RequestContext): Promise<CurrencyEntity[]> {
    const { id: userId } = req.user;

    return await this.prisma.currencies.findMany({
      where: {
        users: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
  }

  public async findAllRates(req: RequestContext): Promise<CurrencyRateEntity[]> {
    const { id: userId } = req.user;
    const { currency: currencyCode } = await this.prisma.users.findUnique({ where: { id: userId } });

    const exchangeRates = await this.prisma.exchangeRates.findMany({
      where: {
        to: {
          users: {
            some: {
              user: {
                id: userId,
              },
            },
          },
        },
      },
      include: { to: true, from: true },
    });

    const results = exchangeRates
      .map((exchangeRate) => ({
        from: exchangeRate.from.code,
        to: exchangeRate.to.code,
        price: exchangeRate.rate,
      }))
      .filter((exchangeRate) => exchangeRate.to === currencyCode);

    if (!results.length) {
      for (const exchangeRate of exchangeRates) {
        if (exchangeRate.from.code === currencyCode) {
          results.push({
            from: exchangeRate.from.code,
            to: exchangeRate.to.code,
            price: 1 / exchangeRate.rate,
          });
        }
      }
    }

    return results;
  }

  public async findOne(code: string): Promise<CurrencyEntity> {
    await this.fetchCurrencies();
    return await this.prisma.currencies.findUniqueOrThrow({
      where: {
        code,
      },
    });
  }

  public async createAllByUser(req: RequestContext, createAllByUserDto: CreateAllByUserDto): Promise<CurrencyEntity[]> {
    const { id: userId } = req.user;
    const { currenciesIds } = createAllByUserDto;

    if (currenciesIds.length === 0) throw new BadRequestException('Select at least one currency');

    const removeCurrenciesByUser = this.prisma.currenciesOnUsers.deleteMany({ where: { userId } });
    const createCurrenciesByUser = this.prisma.currenciesOnUsers.createMany({
      data: currenciesIds.map((id) => ({ userId, currencyId: id })),
      skipDuplicates: true,
    });

    await this.prisma.$transaction([removeCurrenciesByUser, createCurrenciesByUser]);

    return await this.findAllByUser(req);
  }

  public async getExchangeRate(baseCurrency: string, targetCurrency: string) {
    const fromCurrency = await this.findOne(baseCurrency);
    const toCurrency = await this.findOne(targetCurrency);

    if (fromCurrency.id === toCurrency.id) return 1;

    const exchangeRate = await this.prisma.exchangeRates.findFirst({
      where: {
        fromId: fromCurrency.id,
        toId: toCurrency.id,
      },
    });

    if (!exchangeRate) {
      const currencyExchangeRate = await this.fetchCurrencyExchangeRate(baseCurrency, targetCurrency);

      const { rate } = await this.prisma.exchangeRates.create({
        data: {
          fromId: fromCurrency.id,
          toId: toCurrency.id,
          rate: currencyExchangeRate,
        },
      });

      return rate;
    }

    if (exchangeRate.updatedAt.getTime() + Number(this.configService.get<number>('currencies.rateTTL')) < Date.now()) {
      const currencyExchangeRate = await this.fetchCurrencyExchangeRate(baseCurrency, targetCurrency);

      const { rate } = await this.prisma.exchangeRates.update({
        where: {
          id: exchangeRate.id,
        },
        data: {
          rate: currencyExchangeRate,
        },
      });

      return rate;
    }

    return exchangeRate.rate;
  }

  public async additionOfCurrencyAmounts(a: number, b: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) return a + b;

    const currencyExchangeRate = await this.getExchangeRate(toCurrency, fromCurrency);

    return a + b / currencyExchangeRate;
  }

  public async subtractionOfCurrencyAmounts(a: number, b: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) return a - b;

    const currencyExchangeRate = await this.getExchangeRate(toCurrency, fromCurrency);

    return a - b / currencyExchangeRate;
  }

  public async validateCurrency(currency: string) {
    const currencies = await this.findAll();
    const currencyExists = currencies.find((c) => c.code === currency);
    if (!currencyExists) {
      throw new NotFoundException(`Currency ${currency} does not exist`);
    }

    return true;
  }

  private async fetchCurrencyExchangeRate(baseCurrency: string, targetCurrency: string): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(this.configService.get<string>('currencies.ratesEndpoint'), {
          params: {
            base_currency: baseCurrency,
            currencies: targetCurrency,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException('Currencies API error');
          }),
        ),
    );

    return data.data[targetCurrency];
  }

  private async fetchCurrencies(force = false): Promise<void> {
    let currencies: Omit<CurrencyEntity, 'id'>[];

    const countCurrencies = await this.prisma.currencies.count();
    if (countCurrencies && !force) return;

    this.logger.warn(
      force
        ? 'Request force currencies from external API, fetching...'
        : 'Currencies were not found in database, fetching...',
    );

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

    const { count } = await this.prisma.currencies.createMany({
      data: currencies,
      skipDuplicates: true,
    });

    this.logger.log(`Currencies were fetched and "${count}" entity were saved in database`);
  }
}
