import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AccumulationFundEntity } from '@/api/accumulation-funds/entities/accumulation-fund.entity';
import { RequestContext } from '@/shared/types';

import { AccumulationFundsService } from './accumulation-funds.service';
import { CreateAccumulationFundDto } from './dto/create-accumulation-fund.dto';
import { UpdateAccumulationFundDto } from './dto/update-accumulation-fund.dto';

@Controller('accumulation-funds')
@ApiTags('accumulation-funds')
@ApiBearerAuth()
export class AccumulationFundsController {
  constructor(private readonly accumulationFundsService: AccumulationFundsService) {}

  @Post()
  @ApiCreatedResponse({ type: AccumulationFundEntity })
  create(@Request() req: RequestContext, @Body() createAccumulationFundDto: CreateAccumulationFundDto) {
    return this.accumulationFundsService.create(req, createAccumulationFundDto);
  }

  @Get()
  @ApiOkResponse({ type: AccumulationFundEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.accumulationFundsService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: AccumulationFundEntity })
  findOne(@Request() req, @Param('id') id: string) {
    return this.accumulationFundsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AccumulationFundEntity })
  update(@Request() req, @Param('id') id: string, @Body() updateAccumulationFundDto: UpdateAccumulationFundDto) {
    return this.accumulationFundsService.update(req, +id, updateAccumulationFundDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AccumulationFundEntity })
  remove(@Request() req, @Param('id') id: string) {
    return this.accumulationFundsService.remove(req, +id);
  }
}
