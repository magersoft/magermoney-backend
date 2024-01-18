import { ApiProperty } from '@nestjs/swagger';

import { RelationCategoryEntity } from '@/api/categories/entities/relation-category.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeEntity extends BaseEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public dateOfIssue: Date;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty({ type: () => RelationCategoryEntity })
  public category: RelationCategoryEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public savedFundId: number;

  @ApiProperty({ required: false })
  public incomeSourceId?: number;

  @ApiProperty()
  public userId: number;
}
