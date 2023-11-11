import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublic } from '@/shared/decorators';

import { AppService } from './app.service';

@Controller()
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  application() {
    return this.appService.getAppInfo();
  }
}
