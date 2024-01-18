import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CategoriesService } from '@/api/categories/categories.service';
import { CurrenciesService } from '@/api/currencies/currencies.service';
import { ExpenseSourcesService } from '@/api/expense-sources/expense-sources.service';
import { QueryExpensesDto } from '@/api/expenses/dto/query-expenses.dto';
import { ExpenseEntity } from '@/api/expenses/entities/expense.entity';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { usePaginator } from '@/shared/features';
import { RequestContext } from '@/shared/types';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly expenseSourcesService: ExpenseSourcesService,
    private readonly savedFundsService: SavedFundsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async create(req: RequestContext, createExpenseDto: CreateExpenseDto) {
    const { id: userId } = req.user;
    const { title, expenseSourceId, savedFundId, categoryId, currency: currencyCode, ...expenseDto } = createExpenseDto;
    const isSingleExpense = !expenseSourceId;

    const currency = await this.currenciesService.findOne(currencyCode);
    const savedFund = await this.savedFundsService.findOne(req, savedFundId);

    const exchangeRate = await this.currenciesService.getExchangeRate(currency.code, savedFund.currency.code);

    if (savedFund.amount < expenseDto.amount * exchangeRate) throw new BadRequestException('Not enough money');

    if (isSingleExpense) {
      const category = categoryId
        ? await this.categoriesService.findOne(req, categoryId)
        : await this.categoriesService.create(req, { name: title, type: $Enums.CategoryType.EXPENSE });

      const amount = await this.currenciesService.subtractionOfCurrencyAmounts(
        savedFund.amount,
        expenseDto.amount,
        currency.code,
        savedFund.currency.code,
      );

      const updateSaveFund = this.prisma.savedFunds.update({
        where: { id: savedFund.id, userId },
        data: { amount },
      });

      const createExpense = this.prisma.expenses.create({
        data: { ...expenseDto, userId, currencyId: currency.id, savedFundId: savedFund.id, categoryId: category.id },
      });

      const [createdExpense] = await this.prisma.$transaction([createExpense, updateSaveFund]);

      return createdExpense;
    }

    const expenseSource = await this.expenseSourcesService.findOne(req, expenseSourceId);

    const amount = await this.currenciesService.subtractionOfCurrencyAmounts(
      savedFund.amount,
      expenseDto.amount,
      expenseSource.currency.code,
      savedFund.currency.code,
    );

    const updateSaveFund = this.prisma.savedFunds.update({
      where: { id: savedFund.id, userId },
      data: { amount },
    });

    const createExpense = this.prisma.expenses.create({
      data: {
        amount: expenseSource.amount,
        currencyId: expenseSource.currencyId,
        userId: expenseSource.userId,
        categoryId: expenseSource.categoryId,
        savedFundId: savedFund.id,
        expenseSourceId: expenseSource.id,
        dateOfIssue: expenseDto.dateOfIssue,
      },
    });

    const [createdExpense] = await this.prisma.$transaction([createExpense, updateSaveFund]);

    return createdExpense;
  }

  public async findAll(req: RequestContext, query: QueryExpensesDto) {
    const { id: userId } = req.user;
    const { perPage, page, startDate, endDate } = query;

    const { paginate } = usePaginator({ perPage, page });

    return await paginate<ExpenseEntity, Prisma.ExpensesFindManyArgs>(
      this.prisma.expenses,
      {
        where: {
          userId,
          dateOfIssue: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { dateOfIssue: 'desc' },
        include: { currency: true, category: { select: { name: true } } },
      },
      { page },
    );
  }

  public async findAllByPeriod(req: RequestContext, startDate: Date, endDate: Date) {
    const { id: userId } = req.user;

    return await this.prisma.expenses.findMany({
      where: {
        userId,
        dateOfIssue: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { currency: true },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const expense = await this.prisma.expenses.findUniqueOrThrow({
      where: { id },
      include: { currency: true, category: { select: { name: true } } },
    });

    if (expense.userId !== userId) throw new ForbiddenException(`You don't have permission to access this resource`);

    return expense;
  }

  public async update(req: RequestContext, id: number, updateExpenseDto: UpdateExpenseDto) {
    const { id: userId } = req.user;
    const expense = await this.findOne(req, id);

    return await this.prisma.expenses.update({
      where: {
        id: expense.id,
        userId,
      },
      data: { ...updateExpenseDto },
      include: { currency: true, category: { select: { name: true } } },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const expense = await this.findOne(req, id);
    const savedFund = await this.savedFundsService.findOne(req, expense.savedFundId);

    const amount = await this.currenciesService.additionOfCurrencyAmounts(
      savedFund.amount,
      expense.amount,
      expense.currency.code,
      savedFund.currency.code,
    );

    const updateSaveFund = this.prisma.savedFunds.update({
      where: { id: savedFund.id, userId },
      data: { amount },
    });

    const removeExpense = this.prisma.expenses.delete({
      where: {
        id: expense.id,
        userId,
      },
    });

    const [removedExpense] = await this.prisma.$transaction([removeExpense, updateSaveFund]);

    return removedExpense;
  }
}
