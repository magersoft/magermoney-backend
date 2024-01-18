import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { $Enums } from '.prisma/client';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  public readonly name: string;

  @ApiProperty({ enum: $Enums.CategoryType })
  @IsEnum($Enums.CategoryType)
  public readonly type: $Enums.CategoryType;
}
