import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TransferEntity } from '@/api/transfers/entities/transfer.entity';
import { RequestContext } from '@/shared/types';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('transfers')
@ApiTags('transfers')
@ApiBearerAuth()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @ApiCreatedResponse({ type: TransferEntity })
  create(@Request() req: RequestContext, @Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.create(req, createTransferDto);
  }

  @Get()
  @ApiOkResponse({ type: TransferEntity, isArray: true })
  findAll(@Request() req: RequestContext) {
    return this.transfersService.findAll(req);
  }

  @Get(':id')
  @ApiOkResponse({ type: TransferEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.transfersService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TransferEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateTransferDto: UpdateTransferDto) {
    return this.transfersService.update(req, +id, updateTransferDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: TransferEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.transfersService.remove(req, +id);
  }
}
