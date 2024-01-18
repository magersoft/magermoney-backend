import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

import { $Enums } from '.prisma/client';

export class CategoryEntity extends BaseEntity {
  @ApiProperty()
  public name: string;

  @ApiProperty({ default: $Enums.CategoryType.INCOME, enum: $Enums.CategoryType })
  public type: $Enums.CategoryType;

  @ApiProperty({ required: false, nullable: true })
  public userId?: number;
}
