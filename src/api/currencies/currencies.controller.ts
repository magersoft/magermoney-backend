import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';

@Controller('currencies')
@ApiTags('currencies')
@ApiBearerAuth()
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
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
