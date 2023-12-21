import { ApiProperty } from '@nestjs/swagger';

export class TotalMonthlyExpensesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
