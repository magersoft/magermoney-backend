import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsOptional } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/paginated-query.dto';

export class QueryHistoryDto extends PaginatedQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsDateString()
  public readonly startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsDateString()
  public readonly endDate?: Date;
}
