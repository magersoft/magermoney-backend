import { ApiProperty } from '@nestjs/swagger';

import { CategoryRelationEntity } from '@/api/categories/entities/category-relation.entity';
import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';
import { HistoryType } from '@/api/history/enums/history-type.enum';

export class HistoryEntity {
  @ApiProperty({ type: 'enum', enum: HistoryType })
  public type: HistoryType;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty({ type: () => CurrencyEntity })
  public currency: CurrencyEntity;

  @ApiProperty({ type: () => CategoryRelationEntity })
  public category: CategoryRelationEntity;

  @ApiProperty()
  public dateOfIssue: Date;

  @ApiProperty()
  public source: string;
}
