import { ApiProperty } from '@nestjs/swagger';

export class TotalIncomeSourcesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
