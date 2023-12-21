import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { DetectUserEntity } from '@/api/auth/entities/detect-user.entity';
import { VerifyUserEntity } from '@/api/auth/entities/verify-user.entity';
import { generateAuthCode } from '@/api/auth/utils';
import { UserEntity } from '@/api/users/entities/user.entity';
import { UsersService } from '@/api/users/users.service';
import { NotifierService } from '@/modules/notifier/notifier.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private isDev: boolean = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notifier: NotifierService,
    private readonly configService: ConfigService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');
  }

  public async detectUser(data: LoginAuthDto): Promise<DetectUserEntity> {
    const { email, phone } = data;

    let user = await this.usersService.findOneByEmailOrPhone(email, phone);

    if (!user) {
      user = await this.usersService.create({ email, phone });
    }

    if (!user.authCode) {
      const authCode = generateAuthCode();

      user = await this.prisma.users.update({ where: { id: user.id }, data: { authCode } });

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

  public async verifyCode(data: VerifyAuthDto): Promise<VerifyUserEntity> {
    const { userId, authCode, language, darkMode } = data;

    let user = await this.prisma.users.findUniqueOrThrow({ where: { id: userId } });

    if (authCode !== user.authCode) {
      throw new UnauthorizedException('Wrong auth code');
    }

    user = await this.prisma.users.update({ where: { id: user.id }, data: { authCode: null, language, darkMode } });

    return await this.login(user);
  }

  public async login(user: UserEntity) {
    const payload: JwtPayload = { email: user.email, phone: user.phone, sub: user.id };

    return {
      accessToken: !user.authCode ? this.jwtService.sign(payload) : null,
      email: user.email,
      phone: user.phone,
      isFirstTime: user.isFirstTime,
    };
  }
}
