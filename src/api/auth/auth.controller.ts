import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { DetectUserEntity } from '@/api/auth/entities/detect-user.entity';
import { VerifyUserEntity } from '@/api/auth/entities/verify-user.entity';
import { IsPublic } from '@/shared/decorators';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('detect-user')
  @IsPublic()
  @ApiCreatedResponse({ type: DetectUserEntity })
  detectUser(@Body() data: LoginAuthDto): Promise<DetectUserEntity> {
    return this.authService.detectUser(data);
  }

  @Post('verify-user')
  @IsPublic()
  @ApiCreatedResponse({ type: VerifyUserEntity })
  verifyUser(@Body() data: VerifyAuthDto): Promise<VerifyUserEntity> {
    return this.authService.verifyCode(data);
  }
}
