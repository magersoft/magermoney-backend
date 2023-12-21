import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

export class TransferEntity extends BaseEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public toId: number;

  @ApiProperty()
  public fromId: number;

  @ApiProperty()
  public currencyId: number;

  @ApiProperty()
  public userId: number;
}
