import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AccumulatedFundEntity } from '@/api/accumulated-funds/entities/accumulated-fund.entity';
import { RequestContext } from '@/shared/types';

import { AccumulatedFundsService } from './accumulated-funds.service';
import { CreateAccumulatedFundDto } from './dto/create-accumulated-fund.dto';
import { UpdateAccumulatedFundDto } from './dto/update-accumulated-fund.dto';

@Controller('accumulated-funds')
@ApiTags('accumulated-funds')
@ApiBearerAuth()
export class AccumulatedFundsController {
  constructor(private readonly accumulatedFundsService: AccumulatedFundsService) {}

  @Post()
  @ApiCreatedResponse({ type: AccumulatedFundEntity })
  create(@Request() req: RequestContext, @Body() createAccumulatedFundDto: CreateAccumulatedFundDto) {
    return this.accumulatedFundsService.create(req, createAccumulatedFundDto);
  }

  @Get()
  @ApiOkResponse({ type: AccumulatedFundEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.accumulatedFundsService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: AccumulatedFundEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.accumulatedFundsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AccumulatedFundEntity })
  update(
    @Request() req: RequestContext,
    @Param('id') id: string,
    @Body() updateAccumulatedFundDto: UpdateAccumulatedFundDto,
  ) {
    return this.accumulatedFundsService.update(req, +id, updateAccumulatedFundDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AccumulatedFundEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.accumulatedFundsService.remove(req, +id);
  }
}
