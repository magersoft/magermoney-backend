import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeEntity extends BaseEntity {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public distributed: boolean;

  @ApiProperty()
  public dateOfIssue: Date;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public userId: number;
}
