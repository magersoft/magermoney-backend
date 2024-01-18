import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { PrismaModule } from 'nestjs-prisma';
import * as path from 'path';

import { ApiModule } from '@/api/api.module';
import { SharedModule } from '@/shared/shared.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, currenciesConfig, databaseConfig, smtpConfig, throttlerConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, throttlerConfig, smtpConfig, currenciesConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (config: ConfigService) => [
        {
          ttl: config.get<number>('throttler.ttl'),
          limit: config.get<number>('throttler.limit'),
        },
      ],
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        fallbackLanguage: config.get<string>('defaultLanguage'),
        loaderOptions: {
          path: path.join(__dirname, '/locales/'),
          watch: true,
        },
        typesOutputPath: path.join(__dirname, '../../src/shared/generated/i18n.generated.ts'),
      }),
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    ApiModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
