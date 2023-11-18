import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

export class IncomeSourceEntity extends BaseEntity {
  @ApiProperty()
  public title: string;

  @ApiProperty({ required: false, nullable: true })
  public description?: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;

  @ApiProperty({ required: false, nullable: true })
  public userId: number;
}
