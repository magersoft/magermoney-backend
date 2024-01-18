import { ApiProperty } from '@nestjs/swagger';

import { RelationCategoryEntity } from '@/api/categories/entities/relation-category.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeSourceEntity extends BaseEntity {
  @ApiProperty({ required: false, nullable: true })
  public description?: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty()
  public currencyId: string;

  @ApiProperty({ type: () => RelationCategoryEntity })
  public category: RelationCategoryEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public userId: number;
}
