import { ApiProperty } from '@nestjs/swagger';

export class TotalMonthlyIncomesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
