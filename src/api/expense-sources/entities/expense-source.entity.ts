import { ApiProperty } from '@nestjs/swagger';

import { CategoryRelationEntity } from '@/api/categories/entities/category-relation.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class ExpenseSourceEntity extends BaseEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty({ type: () => CategoryRelationEntity })
  public category: CategoryRelationEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public userId: number;
}
