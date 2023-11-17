import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrencyController } from '@/api/currency/currency.controller';
import { CurrencyService } from '@/api/currency/currency.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('currency.apiUrl'),
        params: {
          apikey: configService.get<string>('currency.apiKey'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
