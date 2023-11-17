import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { CurrencyEntity } from '@/api/currency/entities/currency.entity';
import { mocksCurrenciesApiData } from '@/api/currency/mocks/mocksCurrencies';
import { mapCurrencies } from '@/api/currency/utils/mapCurrencies';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private isDev: boolean = false;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');
  }

  async getCurrencies(): Promise<CurrencyEntity[]> {
    if (this.isDev)
      return new Promise((resolve) =>
        setTimeout(() => resolve(mapCurrencies(mocksCurrenciesApiData)), this.configService.get<number>('mocksDelay')),
      );

    const { data } = await firstValueFrom(
      this.httpService.get('/currencies').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new InternalServerErrorException();
        }),
      ),
    );

    return mapCurrencies(data);
  }
}
