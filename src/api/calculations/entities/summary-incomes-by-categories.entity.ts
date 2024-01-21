import { ApiProperty } from '@nestjs/swagger';

export class SummaryIncomesByCategoriesEntity {
  @ApiProperty()
  public categoryId: number;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public percent: number;

  @ApiProperty()
  public currency: string;
}
