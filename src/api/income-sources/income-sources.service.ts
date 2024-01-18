import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CategoriesService } from '@/api/categories/categories.service';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { RequestContext } from '@/shared/types';

import { CreateIncomeSourceDto } from './dto/create-income-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';
import { $Enums } from '.prisma/client';

@Injectable()
export class IncomeSourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async create(req: RequestContext, createIncomeSourceDto: CreateIncomeSourceDto) {
    const { id: userId } = req.user;
    const { title, currency: currencyCode, categoryId, ...incomeSourceDto } = createIncomeSourceDto;

    const category = categoryId
      ? await this.categoriesService.findOne(req, categoryId)
      : await this.categoriesService.create(req, { name: title, type: $Enums.CategoryType.INCOME });

    const currency = await this.currenciesService.findOne(currencyCode);

    return await this.prisma.incomeSources.create({
      data: { ...incomeSourceDto, userId, currencyId: currency.id, categoryId: category.id },
      include: { currency: true, category: { select: { id: true, name: true } } },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.incomeSources.findMany({
      where: {
        userId,
      },
      include: { currency: true, category: { select: { id: true, name: true } } },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const incomeSource = await this.prisma.incomeSources.findUniqueOrThrow({
      where: { id },
      include: { currency: true, category: { select: { id: true, name: true } } },
    });

    if (incomeSource.userId !== userId)
      throw new ForbiddenException(`You don't have permission to access this resource`);

    return incomeSource;
  }

  public async update(req: RequestContext, id: number, updateIncomeSourceDto: UpdateIncomeSourceDto) {
    const { id: userId } = req.user;
    const incomeSource = await this.findOne(req, id);

    const { currency, ...incomeSourceDto } = updateIncomeSourceDto;
    const { id: currencyId } = await this.currenciesService.findOne(currency);

    return await this.prisma.incomeSources.update({
      where: {
        id: incomeSource.id,
        userId,
      },
      data: { ...incomeSourceDto, currencyId },
      include: { currency: true, category: { select: { id: true, name: true } } },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const incomeSource = await this.findOne(req, id);

    return await this.prisma.incomeSources.delete({
      where: { id: incomeSource.id, userId },
      include: { currency: true, category: { select: { id: true, name: true } } },
    });
  }
}
