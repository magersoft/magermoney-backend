import { ApiProperty } from '@nestjs/swagger';

export class TotalBalanceDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
