import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeEntity extends BaseEntity {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public dateOfIssue: Date;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public savedFundId: number;

  @ApiProperty({ required: false })
  public incomeSourceId?: number;

  @ApiProperty()
  public userId: number;
}
