import { PickType } from '@nestjs/swagger';

import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PickType(CreateIncomeDto, ['categoryId', 'dateOfIssue']) {}
