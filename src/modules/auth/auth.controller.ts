import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { DetectUserDto } from '@/modules/auth/dto/detect-user.dto';
import { VerifyUserDto } from '@/modules/auth/dto/verify-user.dto';
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
  @ApiCreatedResponse({ type: DetectUserDto })
  detectUser(@Body() data: LoginAuthDto): Promise<DetectUserDto> {
    return this.authService.detectUser(data);
  }

  @Post('verify-user')
  @IsPublic()
  @ApiCreatedResponse({ type: VerifyUserDto })
  verifyUser(@Body() data: VerifyAuthDto): Promise<VerifyUserDto> {
    return this.authService.verifyCode(data);
  }
}
