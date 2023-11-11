import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { NotifierEmailOptions } from '@/modules/notifier/types/notifier';

@Injectable()
export class NotifierService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  public async sendMail<T>(options: NotifierEmailOptions<T>): Promise<void> {
    try {
      await this.mailerService.sendMail({
        ...options,
        template: `./${options.template}`,
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }
}
