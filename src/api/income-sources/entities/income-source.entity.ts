import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeSourceEntity extends BaseEntity {
  @ApiProperty()
  public title: string;

  @ApiProperty({ required: false, nullable: true })
  public description?: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty()
  public currencyId: string;

  @ApiProperty()
  public userId: number;
}
