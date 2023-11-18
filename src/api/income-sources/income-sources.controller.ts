import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RequestContext } from '@/shared/types';

import { CreateIncomeSourceDto } from './dto/create-income-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';
import { IncomeSourceEntity } from './entities/income-source.entity';
import { IncomeSourcesService } from './income-sources.service';

@Controller('income-sources')
@ApiTags('income-sources')
@ApiBearerAuth()
export class IncomeSourcesController {
  constructor(private readonly incomeSourcesService: IncomeSourcesService) {}

  @Post()
  @ApiCreatedResponse({ type: IncomeSourceEntity })
  create(@Request() req: RequestContext, @Body() createIncomeSourceDto: CreateIncomeSourceDto) {
    return this.incomeSourcesService.create(req, createIncomeSourceDto);
  }

  @Get()
  @ApiOkResponse({ type: IncomeSourceEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.incomeSourcesService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: IncomeSourceEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomeSourcesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: IncomeSourceEntity })
  update(
    @Request() req: RequestContext,
    @Param('id') id: string,
    @Body() updateIncomeSourceDto: UpdateIncomeSourceDto,
  ) {
    return this.incomeSourcesService.update(req, +id, updateIncomeSourceDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: IncomeSourceEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.incomeSourcesService.remove(req, +id);
  }
}
