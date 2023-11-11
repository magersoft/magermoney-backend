import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { UserEntity } from '@/api/user/entities/user.entity';
import { UserService } from '@/api/user/user.service';
import { NotifierService } from '@/modules/notifier/notifier.service';
import { generateAuthCode } from '@/shared/utils';

import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notifier: NotifierService,
  ) {}

  async detectUser(data: LoginAuthDto): Promise<UserEntity> {
    const { email, phone } = data;

    let user = await this.userService.findOneByEmailOrPhone(email, phone);

    if (!user) {
      user = await this.userService.create({ email, phone });
    }

    const authCode = generateAuthCode();

    user = await this.userService.update(user.id, { authCode });

    console.log(authCode); // sendCodeToUser(authCode);
    this.notifier.sendMail<UserEntity>({
      to: user.email,
      subject: 'Magermoney Auth Code',
      template: 'auth-code',
      context: user,
    });

    delete user.authCode;

    return user;
  }

  async verifyCode(data: VerifyAuthDto) {
    const { userId, authCode } = data;

    let user = await this.userService.findOne(userId);

    if (authCode !== user.authCode) {
      throw new UnauthorizedException('Wrong auth code');
    }

    user = await this.userService.update(user.id, { authCode: null });

    return await this.login(user);
  }

  async login(user: UserEntity) {
    const payload: JwtPayload = { email: user.email, phone: user.phone, sub: user.id };

    return {
      access_token: !user.authCode ? this.jwtService.sign(payload) : null,
      email: user.email,
      phone: user.phone,
    };
  }
}
