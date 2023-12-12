import { ApiProperty } from '@nestjs/swagger';

export class TotalMonthlyExpensesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
