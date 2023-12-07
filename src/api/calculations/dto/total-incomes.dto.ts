import { ApiProperty } from '@nestjs/swagger';

export class TotalIncomesDto {
  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly currency: string;
}
