import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { $Enums } from '.prisma/client';

export class QueryCategoryDto {
  @ApiProperty({ enum: $Enums.CategoryType, required: false })
  @IsEnum($Enums.CategoryType)
  @IsOptional()
  public readonly type?: $Enums.CategoryType;
}
