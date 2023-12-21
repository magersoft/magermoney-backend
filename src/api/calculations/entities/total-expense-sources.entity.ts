import { ApiProperty } from '@nestjs/swagger';

export class TotalExpenseSourcesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
