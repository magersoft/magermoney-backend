import { ApiProperty } from '@nestjs/swagger';

export class AmountByPercentEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;

  @ApiProperty()
  public balance: number;

  @ApiProperty()
  public percent: number;
}
