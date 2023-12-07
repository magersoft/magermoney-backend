import { ApiProperty } from '@nestjs/swagger';

export class MonthlyBudgetDto {
  @ApiProperty()
  public readonly budget: number;

  @ApiProperty()
  public readonly spent: number;

  @ApiProperty()
  public readonly restAmount: number;

  @ApiProperty()
  public readonly restAmountPercentage: number;

  @ApiProperty()
  public readonly currency: string;
}
