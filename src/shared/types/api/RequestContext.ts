import { UserEntity } from '@/api/user/entities/user.entity';

export interface RequestContext extends Request {
  user: UserEntity;
}
