import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsPositive } from 'class-validator';

export class CreateAccumulationFundDto {
  @ApiProperty()
  @IsDefined()
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 3,
  })
  public readonly percent: number;
}
