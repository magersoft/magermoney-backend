import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsISO4217CurrencyCode, IsNumber, IsString } from 'class-validator';

export class QueryTransferDetailsDto {
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  public readonly fromId: number;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  public readonly toId: number;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @IsISO4217CurrencyCode()
  @IsDefined()
  public readonly currency: string;
}
