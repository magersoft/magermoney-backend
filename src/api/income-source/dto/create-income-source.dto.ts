import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIncomeSourceDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  public readonly title: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  public readonly description?: string;

  @ApiProperty()
  @IsNumber()
  public readonly amount: number;

  @ApiProperty()
  @IsString()
  @MaxLength(3)
  public readonly currency: string;
}
