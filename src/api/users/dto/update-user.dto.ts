import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @Length(6, 6)
  public readonly authCode?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsBoolean()
  public readonly isFirstTime?: boolean;
}
