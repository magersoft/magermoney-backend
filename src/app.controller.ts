import { Controller, Get } from '@nestjs/common';

import { IsPublic } from '@/shared/decorators';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  application() {
    return this.appService.getAppInfo();
  }
}
