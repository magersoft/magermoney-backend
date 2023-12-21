import { ApiProperty } from '@nestjs/swagger';

export class TotalMonthlyIncomesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
