import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { NotifierService } from '@/modules/notifier/notifier.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('smtp.host'),
          port: config.get<number>('smtp.port'),
          secure: true,
          auth: {
            user: config.get<string>('smtp.user'),
            pass: config.get<string>('smtp.pass'),
          },
        },
        defaults: {
          from: `"Magermoney" <${config.get<string>('smtp.email')}>"`,
        },
        template: {
          dir: join(__dirname, 'templates', 'email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotifierService, Logger],
  exports: [NotifierService],
})
export class NotifierModule {}
