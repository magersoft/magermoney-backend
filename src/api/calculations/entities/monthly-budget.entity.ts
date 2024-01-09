import { ApiProperty } from '@nestjs/swagger';

export class MonthlyBudgetEntity {
  @ApiProperty()
  public budget: number;

  @ApiProperty()
  public spent: number;

  @ApiProperty()
  public restAmount: number;

  @ApiProperty()
  public restAmountPercentage: number;

  @ApiProperty()
  public accumulationFundAmount: number;

  @ApiProperty()
  public availableAmountInDay: number;

  @ApiProperty()
  public currency: string;
}
