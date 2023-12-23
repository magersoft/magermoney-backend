import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { CreateAllByUserDto } from '@/api/currencies/dto/create-all-by-user.dto';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { CurrencyRateEntity } from '@/api/currencies/entities/currency-rate.entity';
import { Roles } from '@/shared/decorators';
import { RequestContext } from '@/shared/types';

import { $Enums } from '.prisma/client';

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

  @Post('fetch')
  @Roles($Enums.Role.ADMIN)
  @ApiOperation({ summary: 'Fetch and create currencies list from external API' })
  @ApiCreatedResponse({ type: CurrencyEntity, isArray: true })
  fetchAndCreateAll() {
    return this.currenciesService.findAll(true);
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

  @Get('rates')
  @ApiOkResponse({ type: CurrencyRateEntity, isArray: true })
  findAllRates(@Request() req: RequestContext) {
    return this.currenciesService.findAllRates(req);
  }

  @Get(':code')
  @ApiOkResponse({ type: CurrencyEntity })
  findOne(@Param('code') code: string) {
    return this.currenciesService.findOne(code);
  }
}
