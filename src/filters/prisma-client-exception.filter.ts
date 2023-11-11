import { providePrismaClientExceptionFilter as _providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { ErrorCodesStatusMapping } from 'nestjs-prisma/dist/prisma-client-exception.filter';
import { HttpStatus } from '@nestjs/common';

export const providePrismaClientExceptionFilter = (errorCodesStatusMapping?: ErrorCodesStatusMapping) =>
  _providePrismaClientExceptionFilter({
    ...errorCodesStatusMapping,
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  });
