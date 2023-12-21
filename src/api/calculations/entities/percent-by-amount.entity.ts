import { ApiProperty } from '@nestjs/swagger';

export class PercentByAmountEntity {
  @ApiProperty()
  public percent: number;

  @ApiProperty()
  public currency: string;

  @ApiProperty()
  public balance: number;

  @ApiProperty()
  public amount: number;
}
