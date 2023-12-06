import { ApiProperty } from '@nestjs/swagger';

export class TotalBalanceDto {
  @ApiProperty()
  public readonly balance: number;

  @ApiProperty()
  public readonly currency: string;
}
