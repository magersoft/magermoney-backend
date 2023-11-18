import { Controller, Get } from '@nestjs/common';
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
  async getCurrencies() {
    return this.currenciesService.getCurrencies();
  }
}
