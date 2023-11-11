import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ required: false, nullable: true })
  @IsEmail()
  public readonly email?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsPhoneNumber()
  public readonly phone?: string;
}
