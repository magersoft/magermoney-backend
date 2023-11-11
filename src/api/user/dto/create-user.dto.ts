import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ required: false, uniqueItems: true, nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  public readonly phone?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  public readonly darkMode?: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  public readonly language?: string;
}
