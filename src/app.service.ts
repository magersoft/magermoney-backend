import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    return {
      title: 'Hello, dude! 🐈 This is Magermoney API',
      author: 'https://github.com/magersoft',
      version: this.configService.get<string>('apiVersion'),
      timestamp: new Date().toISOString(),
    };
  }
}
