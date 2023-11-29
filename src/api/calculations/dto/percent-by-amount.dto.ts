import { ApiProperty } from '@nestjs/swagger';

export class PercentByAmountDto {
  @ApiProperty()
  public readonly percent: number;

  @ApiProperty()
  public readonly currency: string;

  @ApiProperty()
  public readonly balance: number;

  @ApiProperty()
  public readonly amount: number;
}
