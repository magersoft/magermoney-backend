import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor';

import { certificateConfig } from '../secrets/certificates';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const apiGlobalPrefix = `${config.get<string>('apiPrefix')}/${config.get<string>('apiVersion')}`;

  app.enableCors();
  app.setGlobalPrefix(apiGlobalPrefix);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Magermoney API')
    .setDescription('The Magermoney API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = `${config.get<string>('apiPrefix')}/${config.get<string>('apiVersion')}/${config.get<string>(
    'apiDocsPath',
  )}`;

  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(config.get<number>('port'), config.get<string>('host'));
}
bootstrap();
