import { Injectable } from '@nestjs/common';

import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class CalculationsService {
  constructor(private readonly incomeSourcesService: IncomeSourcesService) {}

  public async getAccumulationFundPercent(req: RequestContext, amount: number) {
    const incomeSources = await this.incomeSourcesService.findAll(req);
  }

  public async getAccumulationFundAmount(req: RequestContext, percent: number) {}
}
