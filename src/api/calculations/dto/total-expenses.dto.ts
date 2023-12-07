import { ApiProperty } from '@nestjs/swagger';

export class TotalExpensesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
