import { ApiProperty } from '@nestjs/swagger';

export class CurrencyEntity {
  @ApiProperty()
  public readonly symbol: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly code: string;
}
