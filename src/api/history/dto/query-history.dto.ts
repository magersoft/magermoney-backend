import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/paginated-query.dto';

export class QueryHistoryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  public readonly startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  public readonly endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  public readonly savedFundId?: number;
}
