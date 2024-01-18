import { ApiProperty } from '@nestjs/swagger';

import { CategoryRelationEntity } from '@/api/categories/entities/category-relation.entity';
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

  @ApiProperty({ type: () => CategoryRelationEntity })
  public category: CategoryRelationEntity;

  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public userId: number;
}
