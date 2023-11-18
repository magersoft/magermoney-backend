import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrenciesController } from '@/api/currencies/currencies.controller';
import { CurrenciesService } from '@/api/currencies/currencies.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('currencies.apiUrl'),
        params: {
          apikey: configService.get<string>('currencies.apiKey'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
