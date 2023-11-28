import { PartialType } from '@nestjs/swagger';
import { CreateAccumulationFundDto } from './create-accumulation-fund.dto';

export class UpdateAccumulationFundDto extends PartialType(CreateAccumulationFundDto) {}
