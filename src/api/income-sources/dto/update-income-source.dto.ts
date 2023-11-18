import { PartialType } from '@nestjs/swagger';
import { CreateIncomeSourceDto } from './create-income-source.dto';

export class UpdateIncomeSourceDto extends PartialType(CreateIncomeSourceDto) {}
