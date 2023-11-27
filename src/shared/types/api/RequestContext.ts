import { UserEntity } from '@/api/users/entities/user.entity';

export interface RequestContext extends Request {
  user: UserEntity;
}
