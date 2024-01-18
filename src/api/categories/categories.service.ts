import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { defaultCategories } from '@/api/categories/data/defaultCategories';
import { QueryCategoryDto } from '@/api/categories/dto/query-category.dto';
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
    const { type } = query;

    return await this.prisma.categories.findMany({
      where: {
        OR: [{ isDefault: true }, { userId }],
        AND: type ? [{ type }] : [],
      },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    // @todo check if user has access to this category

    return await this.prisma.categories.findUniqueOrThrow({
      where: { id },
    });
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} category`;
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
