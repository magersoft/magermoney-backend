import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DetectUserDto } from '@/api/auth/dto/detect-user.dto';
import { generateAuthCode } from '@/api/auth/utils';
import { UserEntity } from '@/api/user/entities/user.entity';
import { UserService } from '@/api/user/user.service';
import { NotifierService } from '@/modules/notifier/notifier.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private isDev: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notifier: NotifierService,
    private readonly configService: ConfigService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');
  }

  public async detectUser(data: LoginAuthDto): Promise<DetectUserDto> {
    const { email, phone } = data;

    let user = await this.userService.findOneByEmailOrPhone(email, phone);

    if (!user) {
      user = await this.userService.create({ email, phone });
    }

    if (!user.authCode) {
      const authCode = generateAuthCode();

      user = await this.userService.update(user.id, { authCode });

      if (this.isDev) {
        this.logger.debug(`Auth code: ${authCode}`);
      } else {
        this.notifier.sendMail<UserEntity>({
          to: user.email,
          subject: 'Magermoney Auth Code',
          template: 'auth-code',
          context: user,
        });
      }
    }

    return { id: user.id };
  }

  public async verifyCode(data: VerifyAuthDto) {
    const { userId, authCode } = data;

    let user = await this.userService.findOne(userId);

    if (authCode !== user.authCode) {
      throw new UnauthorizedException('Wrong auth code');
    }

    user = await this.userService.update(user.id, { authCode: null });

    return await this.login(user);
  }

  public async login(user: UserEntity) {
    const payload: JwtPayload = { email: user.email, phone: user.phone, sub: user.id };

    return {
      accessToken: !user.authCode ? this.jwtService.sign(payload) : null,
      email: user.email,
      phone: user.phone,
    };
  }
}
