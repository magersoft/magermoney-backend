import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsHexColor,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSavedFundDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly source: string;

  @ApiProperty()
  @IsDefined()
  @Min(0)
  @IsNumber()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsISO4217CurrencyCode()
  public readonly currency: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @MaxLength(7)
  public readonly color?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  public readonly order?: number;
}
