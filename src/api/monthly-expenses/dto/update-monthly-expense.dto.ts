import { PartialType } from '@nestjs/swagger';
import { CreateMonthlyExpenseDto } from './create-monthly-expense.dto';

export class UpdateMonthlyExpenseDto extends PartialType(CreateMonthlyExpenseDto) {}
