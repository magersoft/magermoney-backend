import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/paginated-query.dto';

export class QueryIncomesDto extends PaginatedQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  public readonly startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  public readonly endDate?: Date;
}
