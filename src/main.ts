import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { certificateConfig } from '../secrets/certificates';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: { ...certificateConfig },
  });
  const config = app.get(ConfigService);
  const apiGlobalPrefix = `${config.get<string>('apiPrefix')}/${config.get<string>('apiVersion')}`;

  app.setGlobalPrefix(apiGlobalPrefix);
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Magermoney API')
    .setDescription('The Magermoney API description')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = `${config.get<string>('apiPrefix')}/${config.get<string>('apiDocsPath')}`;

  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(config.get<number>('port'), config.get<string>('host'));
}
bootstrap();
