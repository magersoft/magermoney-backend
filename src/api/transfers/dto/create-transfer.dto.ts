import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsISO4217CurrencyCode, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsDefined()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsISO4217CurrencyCode()
  @IsDefined()
  public readonly currency: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsDefined()
  public readonly toId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsDefined()
  public readonly fromId: number;
}
