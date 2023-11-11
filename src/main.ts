import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { certificateConfig } from '../secrets/certificates';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);

  app.enableCors();
  await app.listen(config.get<number>('port'), config.get<string>('host'));
}
bootstrap();
