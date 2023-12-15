import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UpdateOrdersSavedFundsDto } from '@/api/saved-funds/dto/update-orders-saved-funds.dto';
import { SavedFundEntity } from '@/api/saved-funds/entities/saved-fund.entity';
import { RequestContext } from '@/shared/types';

import { CreateSavedFundDto } from './dto/create-saved-fund.dto';
import { UpdateSavedFundDto } from './dto/update-saved-fund.dto';
import { SavedFundsService } from './saved-funds.service';

@Controller('saved-funds')
@ApiTags('saved-funds')
@ApiBearerAuth()
export class SavedFundsController {
  constructor(private readonly savedFundsService: SavedFundsService) {}

  @Post()
  @ApiCreatedResponse({ type: SavedFundEntity })
  create(@Request() req: RequestContext, @Body() createSavedFundDto: CreateSavedFundDto) {
    return this.savedFundsService.create(req, createSavedFundDto);
  }

  @Get()
  @ApiOkResponse({ type: SavedFundEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.savedFundsService.findAll(req);
  }

  @Patch('/orders')
  @ApiOkResponse({ type: SavedFundEntity, isArray: true })
  updateOrders(@Request() req: RequestContext, @Body() updateOrdersSavedFundsDto: UpdateOrdersSavedFundsDto) {
    return this.savedFundsService.updateOrders(req, updateOrdersSavedFundsDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: SavedFundEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.savedFundsService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SavedFundEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateSavedFundDto: UpdateSavedFundDto) {
    return this.savedFundsService.update(req, +id, updateSavedFundDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: SavedFundEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.savedFundsService.remove(req, +id);
  }
}
