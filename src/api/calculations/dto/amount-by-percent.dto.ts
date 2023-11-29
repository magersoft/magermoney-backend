import { ApiProperty } from '@nestjs/swagger';

export class AmountByPercentDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;

  @ApiProperty()
  public readonly balance: number;

  @ApiProperty()
  public readonly percent: number;
}
