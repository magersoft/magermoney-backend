import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { ApiModule } from '@/api/api.module';
import { providePrismaClientExceptionFilter } from '@/shared/filters';
import { SharedModule } from '@/shared/shared.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, currencyConfig, databaseConfig, smtpConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, smtpConfig, currencyConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, providePrismaClientExceptionFilter()],
})
export class AppModule {}
