import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Length } from 'class-validator';

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
}
