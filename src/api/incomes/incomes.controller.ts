import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { IncomeEntity } from '@/api/incomes/entities/income.entity';
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
  @ApiOkResponse({ type: IncomeEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.incomesService.findAll(req);
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
