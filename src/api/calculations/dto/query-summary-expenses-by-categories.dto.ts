import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsISO4217CurrencyCode, IsOptional, IsString } from 'class-validator';

import { BEGIN_MONTH, END_MONTH } from '@/shared/constants';

export class QuerySummaryExpensesByCategoriesDto {
  @ApiProperty({ required: false, default: BEGIN_MONTH })
  @IsOptional()
  @IsDate()
  public readonly startDate?: Date = BEGIN_MONTH;

  @ApiProperty({ required: false, default: END_MONTH })
  @IsOptional()
  @IsDate()
  public readonly endDate?: Date = END_MONTH;

  @ApiProperty()
  @IsString()
  @IsISO4217CurrencyCode()
  @IsDefined()
  public readonly currency: string;
}
