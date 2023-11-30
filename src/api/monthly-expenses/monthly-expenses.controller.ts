import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MonthlyExpenseEntity } from '@/api/monthly-expenses/entities/monthly-expense.entity';
import { RequestContext } from '@/shared/types';

import { CreateMonthlyExpenseDto } from './dto/create-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dto/update-monthly-expense.dto';
import { MonthlyExpensesService } from './monthly-expenses.service';

@Controller('monthly-expenses')
@ApiTags('monthly-expenses')
@ApiBearerAuth()
export class MonthlyExpensesController {
  constructor(private readonly monthlyExpensesService: MonthlyExpensesService) {}

  @Post()
  @ApiCreatedResponse({ type: MonthlyExpenseEntity })
  create(@Request() req: RequestContext, @Body() createMonthlyExpenseDto: CreateMonthlyExpenseDto) {
    return this.monthlyExpensesService.create(req, createMonthlyExpenseDto);
  }

  @Get()
  @ApiOkResponse({ type: MonthlyExpenseEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.monthlyExpensesService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: MonthlyExpenseEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.monthlyExpensesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MonthlyExpenseEntity })
  update(
    @Request() req: RequestContext,
    @Param('id') id: string,
    @Body() updateMonthlyExpenseDto: UpdateMonthlyExpenseDto,
  ) {
    return this.monthlyExpensesService.update(req, +id, updateMonthlyExpenseDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MonthlyExpenseEntity })
  remove(@Request() req, @Param('id') id: string) {
    return this.monthlyExpensesService.remove(req, +id);
  }
}
