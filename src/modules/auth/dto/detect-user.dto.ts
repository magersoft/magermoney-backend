import { PickType } from '@nestjs/swagger';

import { UserEntity } from '@/api/user/entities/user.entity';

export class DetectUserDto extends PickType(UserEntity, ['id']) {}
