import { ApiProperty } from '@nestjs/swagger';

export class CurrencyRateEntity {
  @ApiProperty()
  public from: string;

  @ApiProperty()
  public to: string;

  @ApiProperty()
  public price: number;
}
