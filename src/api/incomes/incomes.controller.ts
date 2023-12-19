import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryIncomesDto } from '@/api/incomes/dto/query-incomes.dto';
import { IncomeEntity } from '@/api/incomes/entities/income.entity';
import { ApiPaginatedResponse } from '@/shared/decorators/paginated.decorator';
import { RequestContext } from '@/shared/types';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

@Controller('incomes')
@ApiTags('incomes')
@ApiBearerAuth()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiCreatedResponse({ type: IncomeEntity })
  create(@Request() req, @Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(req, createIncomeDto);
  }

  @Get()
  @ApiPaginatedResponse(IncomeEntity)
  findAll(@Request() req: RequestContext, @Query() query: QueryIncomesDto) {
    return this.incomesService.findAll(req, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: IncomeEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: IncomeEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomesService.update(req, +id, updateIncomeDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: IncomeEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomesService.remove(req, +id);
  }
}
