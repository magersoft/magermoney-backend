import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  public readonly title?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public readonly categoryId?: number;

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
