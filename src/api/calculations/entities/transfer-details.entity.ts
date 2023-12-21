import { ApiProperty } from '@nestjs/swagger';

import { TotalBalanceEntity } from '@/api/calculations/entities/total-balance.entity';

export class TransferDetailsEntity {
  @ApiProperty({ type: () => TotalBalanceEntity })
  public outcome: TotalBalanceEntity;

  @ApiProperty({ type: () => TotalBalanceEntity })
  public income: TotalBalanceEntity;

  @ApiProperty({ type: () => TotalBalanceEntity })
  public rate: TotalBalanceEntity;
}
