import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsHexColor,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSavedFundDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
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
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public readonly categoryId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @MaxLength(7)
  public readonly color?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  public readonly order?: number;
}
