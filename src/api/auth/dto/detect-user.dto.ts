import { PickType } from '@nestjs/swagger';

import { UserEntity } from '@/api/users/entities/user.entity';

export class DetectUserDto extends PickType(UserEntity, ['id']) {}
