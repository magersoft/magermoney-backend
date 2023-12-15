import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined } from 'class-validator';

export class UpdateOrdersSavedFundsDto {
  @ApiProperty()
  @IsArray()
  @IsDefined()
  public readonly ids: number[];
}
