import { ApiProperty } from '@nestjs/swagger';

import { CategoryRelationEntity } from '@/api/categories/entities/category-relation.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { SavedFundRelationEntity } from '@/api/saved-funds/entities/saved-fund-relation.entity';
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

  @ApiProperty({ type: () => CategoryRelationEntity })
  public category: CategoryRelationEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty({ type: () => SavedFundRelationEntity })
  public savedFund: SavedFundRelationEntity;

  @ApiProperty()
  public savedFundId: number;

  @ApiProperty({ required: false })
  public incomeSourceId?: number;

  @ApiProperty()
  public userId: number;
}
