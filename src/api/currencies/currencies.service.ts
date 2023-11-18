import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { mocksCurrenciesApiData } from '@/api/currencies/mocks/mocksCurrencies';
import { mapCurrencies } from '@/api/currencies/utils/mapCurrencies';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);
  private isDev: boolean = false;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');
  }

  public async getCurrencies(): Promise<CurrencyEntity[]> {
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
