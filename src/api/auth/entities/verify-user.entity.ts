import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserEntity {
  @ApiProperty({ nullable: true })
  public accessToken: string | null;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public isFirstTime: boolean;
}
