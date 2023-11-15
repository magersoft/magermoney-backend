import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
