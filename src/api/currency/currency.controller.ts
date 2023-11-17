import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrencyService } from '@/api/currency/currency.service';
import { CurrencyEntity } from '@/api/currency/entities/currency.entity';

@Controller('currency')
@ApiTags('currency')
@ApiBearerAuth()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOkResponse({ type: CurrencyEntity, isArray: true })
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }
}
