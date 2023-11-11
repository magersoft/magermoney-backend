import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@/api/user/user.service';

export interface JwtPayload {
  sub: number;
  email: string;
  phone: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: config.get<boolean>('isDev'),
      secretOrKey: config.get<string>('jwtSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;
    return await this.userService.findOne(+id);
  }
}
