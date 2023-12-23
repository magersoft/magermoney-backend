import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Min } from 'class-validator';

export class CreateAccumulationFundDto {
  @ApiProperty()
  @IsDefined()
  @Min(0)
  @IsNumber({
    maxDecimalPlaces: 3,
  })
  public readonly percent: number;
}
