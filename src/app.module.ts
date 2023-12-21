import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'nestjs-prisma';

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
    ApiModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
