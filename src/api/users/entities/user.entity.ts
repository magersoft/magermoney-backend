import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/shared/entities/base.entity';

import { $Enums } from '.prisma/client';

export class UserEntity extends BaseEntity {
  @ApiProperty()
  public email: string;

  @ApiProperty({ required: false, nullable: true })
  public phone?: string;

  @ApiProperty({ required: false, nullable: true })
  public authCode?: string;

  @ApiProperty({ default: false })
  public darkMode?: boolean = false;

  @ApiProperty({ default: false })
  public isFirstTime?: boolean = false;

  @ApiProperty()
  public language: string;

  @ApiProperty()
  public currency: string;

  @ApiProperty({ default: $Enums.Role.USER, enum: $Enums.Role })
  public role: $Enums.Role;
}
