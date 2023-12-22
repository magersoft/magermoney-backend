import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { CreateAllByUserDto } from '@/api/currencies/dto/create-all-by-user.dto';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { RequestContext } from '@/shared/types';

@Controller('currencies')
@ApiTags('currencies')
@ApiBearerAuth()
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiCreatedResponse({ type: CurrencyEntity, isArray: true })
  createAllByUser(@Request() req: RequestContext, @Body() createAllByUserDto: CreateAllByUserDto) {
    return this.currenciesService.createAllByUser(req, createAllByUserDto);
  }

  @Get()
  @ApiOkResponse({ type: CurrencyEntity, isArray: true })
  findAllByUser(@Request() req: RequestContext) {
    return this.currenciesService.findAllByUser(req);
  }

  @Get('list')
  @ApiOkResponse({ type: CurrencyEntity, isArray: true })
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':code')
  @ApiOkResponse({ type: CurrencyEntity })
  findOne(@Param('code') code: string) {
    return this.currenciesService.findOne(code);
  }
}
