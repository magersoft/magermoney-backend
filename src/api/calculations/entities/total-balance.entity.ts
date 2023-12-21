import { ApiProperty } from '@nestjs/swagger';

export class TotalBalanceEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
