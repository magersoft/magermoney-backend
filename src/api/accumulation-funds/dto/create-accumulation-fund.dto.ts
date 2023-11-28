import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateAccumulationFundDto {
  @ApiProperty()
  @IsDefined()
  @IsPositive()
  @IsNumber()
  @MaxLength(3)
  public readonly percent: number;
}
