import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

export class AccumulatedFundEntity extends BaseEntity {
  @ApiProperty()
  public source: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;

  @ApiProperty({ required: false, nullable: true })
  public userId: number;
}
