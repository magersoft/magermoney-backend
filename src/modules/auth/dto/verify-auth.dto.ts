import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class VerifyAuthDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(6, 6)
  public readonly authCode: string;

  @ApiProperty({ required: true })
  @IsNumber()
  public readonly userId: number;
}
