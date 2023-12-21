import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsDefined()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsISO4217CurrencyCode()
  @IsDefined()
  public readonly currency: string;

  @ApiProperty()
  @IsDate()
  @IsDefined()
  public readonly dateOfIssue: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  public readonly incomeSourceId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsDefined()
  public readonly savedFundId?: number;
}
