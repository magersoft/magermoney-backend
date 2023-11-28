import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('calculations')
@ApiTags('calculations')
@ApiBearerAuth()
export class CalculationsController {}
