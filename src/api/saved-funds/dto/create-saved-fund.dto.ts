import { ApiProperty } from '@nestjs/swagger';
import { IsCurrency, IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateSavedFundDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly source: string;

  @ApiProperty()
  @IsDefined()
  @IsPositive()
  @IsNumber()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsCurrency()
  @MaxLength(3)
  public readonly currency: string;
}
