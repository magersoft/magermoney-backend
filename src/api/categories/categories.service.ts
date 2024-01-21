import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { defaultCategories } from '@/api/categories/data/defaultCategories';
import { QueryCategoryDto } from '@/api/categories/dto/query-category.dto';
import { CategoryEntity } from '@/api/categories/entities/category.entity';
import { usePaginator } from '@/shared/features';
import { RequestContext } from '@/shared/types';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {
    this.init();
  }

  public async create(req: RequestContext, createCategoryDto: CreateCategoryDto) {
    const { id: userId } = req.user;

    return await this.prisma.categories.create({
      data: { ...createCategoryDto, userId },
    });
  }

  public async findAll(req: RequestContext, query: QueryCategoryDto) {
    const { id: userId } = req.user;
    const { type, page, perPage, ...queryCategoryDto } = query;

    if (!page && !perPage) {
      return await this.prisma.categories.findMany({
        where: {
          OR: [{ ...queryCategoryDto }, { userId }],
          AND: type ? [{ type }] : [],
        },
      });
    }

    const { paginate } = usePaginator({ page, perPage });

    return await paginate<CategoryEntity, Prisma.CategoriesFindManyArgs>(
      this.prisma.categories,
      {
        where: {
          ...queryCategoryDto,
          userId,
        },
      },
      { page },
    );
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const category = await this.prisma.categories.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: {
            incomes: true,
            expenses: true,
          },
        },
      },
    });

    if (category.userId && category.userId !== userId)
      throw new ForbiddenException('You are not allowed to access this resource');

    return category;
  }

  public async update(req: RequestContext, id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(req, id);
    return await this.prisma.categories.update({
      where: { id: category.id },
      data: { ...updateCategoryDto },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const category = await this.findOne(req, id);

    if (category._count.incomes || category._count.expenses) {
      throw new BadRequestException('You cannot delete a category that has incomes or expenses');
    }

    return await this.prisma.categories.delete({ where: { id: category.id } });
  }

  private async init() {
    let categoriesCount = 0;

    for (const existedCategory of defaultCategories) {
      const category = await this.prisma.categories.findFirst({ where: { ...existedCategory, isDefault: true } });

      if (!category) {
        await this.prisma.categories.create({
          data: { ...existedCategory, isDefault: true },
        });

        categoriesCount++;
      }
    }

    if (!categoriesCount) return;

    this.logger.log(`Added ${categoriesCount} default categories`);
  }
}
