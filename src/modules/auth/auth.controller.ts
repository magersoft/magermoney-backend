import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublic } from '@/shared/decorators';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('detect-user')
  @IsPublic()
  detectUser(@Body() data: LoginAuthDto) {
    return this.authService.detectUser(data);
  }

  @Post('verify-code')
  @IsPublic()
  verifyUser(@Body() data: VerifyAuthDto) {
    return this.authService.verifyCode(data);
  }
}
