import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  public readonly amount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsISO4217CurrencyCode()
  @MaxLength(3)
  public readonly currency: string;

  @ApiProperty()
  @IsDate()
  public readonly dateOfIssue: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  public readonly distributed?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  public readonly incomeSourceId?: number;
}
