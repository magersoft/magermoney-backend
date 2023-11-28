import { ApiProperty } from '@nestjs/swagger';

export class AccumulationFundEntity {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public percent: number;

  @ApiProperty({ required: false, nullable: true })
  public userId: number;
}
