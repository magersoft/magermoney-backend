import { ApiProperty } from '@nestjs/swagger';

export class TotalIncomeSourcesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
