import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ExpenseEntity } from '@/api/expenses/entities/expense.entity';
import { RequestContext } from '@/shared/types';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
@ApiTags('expenses')
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiCreatedResponse({ type: ExpenseEntity })
  create(@Request() req: RequestContext, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(req, createExpenseDto);
  }

  @Get()
  @ApiOkResponse({ type: ExpenseEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.expensesService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: ExpenseEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.expensesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExpenseEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(req, +id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ExpenseEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.expensesService.remove(req, +id);
  }
}
