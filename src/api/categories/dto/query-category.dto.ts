import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { PaginatedQueryDto } from '@/shared/dto/paginated-query.dto';

import { $Enums } from '.prisma/client';

export class QueryCategoryDto extends PaginatedQueryDto {
  @ApiProperty({ enum: $Enums.CategoryType, required: false })
  @IsEnum($Enums.CategoryType)
  @IsOptional()
  public readonly type?: $Enums.CategoryType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public readonly isDefault?: boolean;
}
