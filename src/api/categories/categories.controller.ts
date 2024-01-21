import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryCategoryDto } from '@/api/categories/dto/query-category.dto';
import { CategoryEntity } from '@/api/categories/entities/category.entity';
import { RequestContext } from '@/shared/types';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: CategoryEntity })
  create(@Request() req: RequestContext, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req, createCategoryDto);
  }

  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  findAll(@Request() req: RequestContext, @Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(req, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.categoriesService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(req, +id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoryEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.categoriesService.remove(req, +id);
  }
}
