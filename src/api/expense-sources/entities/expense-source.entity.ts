import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class ExpenseSourceEntity extends BaseEntity {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public userId: number;
}
