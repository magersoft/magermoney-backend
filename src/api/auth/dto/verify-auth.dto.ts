import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsLocale, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class VerifyAuthDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(6, 6)
  public readonly authCode: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  public readonly userId: number;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  public readonly darkMode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLocale()
  public readonly language?: string;
}
