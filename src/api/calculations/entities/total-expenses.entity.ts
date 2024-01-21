import { ApiProperty } from '@nestjs/swagger';

export class TotalExpensesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
