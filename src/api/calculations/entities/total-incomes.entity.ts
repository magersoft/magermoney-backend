import { ApiProperty } from '@nestjs/swagger';

export class TotalIncomesEntity {
  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency: string;
}
