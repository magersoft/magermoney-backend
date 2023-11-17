import { PartialType } from '@nestjs/swagger';
import { CreateAccumulatedFundDto } from './create-accumulated-fund.dto';

export class UpdateAccumulatedFundDto extends PartialType(CreateAccumulatedFundDto) {}
