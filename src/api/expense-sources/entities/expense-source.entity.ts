import { ApiProperty } from '@nestjs/swagger';

import { RelationCategoryEntity } from '@/api/categories/entities/relation-category.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class ExpenseSourceEntity extends BaseEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty({ type: () => RelationCategoryEntity })
  public category: RelationCategoryEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public userId: number;
}
