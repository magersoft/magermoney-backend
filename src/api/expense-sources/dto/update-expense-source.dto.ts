import { PartialType } from '@nestjs/swagger';

import { CreateExpenseSourceDto } from './create-expense-source.dto';

export class UpdateExpenseSourceDto extends PartialType(CreateExpenseSourceDto) {}
