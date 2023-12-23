import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsISO4217CurrencyCode,
  IsLocale,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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

  @ApiProperty({ required: false })
  @IsString()
  @IsISO4217CurrencyCode()
  @IsOptional()
  public readonly currency?: string;
}
