import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ExpenseSourceEntity } from '@/api/expense-sources/entities/expense-source.entity';
import { RequestContext } from '@/shared/types';

import { CreateExpenseSourceDto } from './dto/create-expense-source.dto';
import { UpdateExpenseSourceDto } from './dto/update-expense-source.dto';
import { ExpenseSourcesService } from './expense-sources.service';

@Controller('expense-sources')
@ApiTags('expense-sources')
@ApiBearerAuth()
export class ExpenseSourcesController {
  constructor(private readonly expenseSourcesService: ExpenseSourcesService) {}

  @Post()
  @ApiCreatedResponse({ type: ExpenseSourceEntity })
  create(@Request() req: RequestContext, @Body() createExpenseSourceDto: CreateExpenseSourceDto) {
    return this.expenseSourcesService.create(req, createExpenseSourceDto);
  }

  @Get()
  @ApiOkResponse({ type: ExpenseSourceEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.expenseSourcesService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: ExpenseSourceEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.expenseSourcesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExpenseSourceEntity })
  update(
    @Request() req: RequestContext,
    @Param('id') id: string,
    @Body() updateExpenseSourceDto: UpdateExpenseSourceDto,
  ) {
    return this.expenseSourcesService.update(req, +id, updateExpenseSourceDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ExpenseSourceEntity })
  remove(@Request() req, @Param('id') id: string) {
    return this.expenseSourcesService.remove(req, +id);
  }
}
