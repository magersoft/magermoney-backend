import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CategoriesService } from '@/api/categories/categories.service';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { RequestContext } from '@/shared/types';

import { CreateExpenseSourceDto } from './dto/create-expense-source.dto';
import { UpdateExpenseSourceDto } from './dto/update-expense-source.dto';
import { $Enums } from '.prisma/client';

@Injectable()
export class ExpenseSourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async create(req: RequestContext, createExpenseSourceDto: CreateExpenseSourceDto) {
    const { id: userId } = req.user;
    const { title, currency: currencyCode, categoryId, ...expenseSourceDto } = createExpenseSourceDto;

    const category = categoryId
      ? await this.categoriesService.findOne(req, categoryId)
      : await this.categoriesService.create(req, { name: title, type: $Enums.CategoryType.EXPENSE });

    const currency = await this.currenciesService.findOne(currencyCode);

    return await this.prisma.expenseSources.create({
      data: { ...expenseSourceDto, userId, currencyId: currency.id, categoryId: category.id },
      include: { currency: true, category: { select: { name: true } } },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.expenseSources.findMany({
      where: {
        userId,
      },
      include: { currency: true, category: { select: { name: true } } },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const expenseSource = await this.prisma.expenseSources.findUniqueOrThrow({
      where: { id },
      include: { currency: true, category: { select: { name: true } } },
    });

    if (expenseSource.userId !== userId)
      throw new ForbiddenException(`You don't have permission to access this resource`);

    return expenseSource;
  }

  public async update(req: RequestContext, id: number, updateExpenseSourceDto: UpdateExpenseSourceDto) {
    const { id: userId } = req.user;
    const expenseSource = await this.findOne(req, id);

    const { currency, ...expenseSourceDto } = updateExpenseSourceDto;
    const { id: currencyId } = await this.currenciesService.findOne(currency);

    return await this.prisma.expenseSources.update({
      where: {
        id: expenseSource.id,
        userId,
      },
      data: { ...expenseSourceDto, currencyId },
      include: { currency: true, category: { select: { name: true } } },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const expenseSource = await this.findOne(req, id);

    return await this.prisma.expenseSources.delete({
      where: { id: expenseSource.id, userId },
      include: { currency: true, category: { select: { name: true } } },
    });
  }
}
