import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public email: string;

  @ApiProperty({ required: false, nullable: true })
  public phone?: string;

  @ApiProperty({ required: false, nullable: true })
  public authCode?: string;

  @ApiProperty({ default: false })
  public darkMode?: boolean = false;

  @ApiProperty()
  public language: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
