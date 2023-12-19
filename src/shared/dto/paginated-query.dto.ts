import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  public readonly page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  public readonly perPage?: number;
}
