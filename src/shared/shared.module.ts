import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { providePrismaClientExceptionFilter } from '@/shared/filters';
import { RolesGuard } from '@/shared/guards/roles.guard';

@Module({
  providers: [
    providePrismaClientExceptionFilter(),
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class SharedModule {}
