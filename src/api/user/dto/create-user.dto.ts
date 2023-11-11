import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  public readonly email: string;

  @ApiProperty({ required: false, uniqueItems: true, nullable: true })
  public readonly phone?: string;

  @ApiProperty({ required: false, default: false })
  public readonly darkMode?: boolean = false;

  @ApiProperty({ required: false })
  public readonly language?: string;
}
