import { ApiProperty } from '@nestjs/swagger';

export class TotalExpenseSourcesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
