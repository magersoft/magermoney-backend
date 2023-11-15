import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { IncomeSourceEntity } from '@/api/income-source/entities/income-source.entity';
import { RequestContext } from '@/shared/types';

import { CreateIncomeSourceDto } from './dto/create-income-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';
import { IncomeSourceService } from './income-source.service';

@Controller('income-source')
@ApiTags('income-source')
@ApiBearerAuth()
export class IncomeSourceController {
  constructor(private readonly incomeSourceService: IncomeSourceService) {}

  @Post()
  @ApiCreatedResponse({ type: IncomeSourceEntity })
  create(@Request() req: RequestContext, @Body() createIncomeSourceDto: CreateIncomeSourceDto) {
    return this.incomeSourceService.create(req, createIncomeSourceDto);
  }

  @Get()
  @ApiOkResponse({ type: IncomeSourceEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.incomeSourceService.findAll(req);
  }

  @Get(':id')
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomeSourceService.findOne(req, +id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestContext,
    @Param('id') id: string,
    @Body() updateIncomeSourceDto: UpdateIncomeSourceDto,
  ) {
    return this.incomeSourceService.update(req, +id, updateIncomeSourceDto);
  }

  @Delete(':id')
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomeSourceService.remove(req, +id);
  }
}
