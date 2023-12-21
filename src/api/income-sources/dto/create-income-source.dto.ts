import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateIncomeSourceDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly title: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  public readonly description?: string;

  @ApiProperty()
  @IsDefined()
  @IsPositive()
  @IsNumber()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsISO4217CurrencyCode()
  public readonly currency: string;
}
