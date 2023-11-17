import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {
  @ApiProperty({ nullable: true })
  public readonly accessToken: string | null;

  @ApiProperty()
  public readonly email: string;

  @ApiProperty()
  public readonly phone: string;
}
