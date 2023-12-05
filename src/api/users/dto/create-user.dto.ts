import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsLocale, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ uniqueItems: true })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ required: false, uniqueItems: true, nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  public readonly phone?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  public readonly darkMode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLocale()
  public readonly language?: string;
}
