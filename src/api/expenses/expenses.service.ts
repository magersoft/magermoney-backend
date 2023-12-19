import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

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
  ) {}

  public async create(req: RequestContext, createExpenseDto: CreateExpenseDto) {
    const { id: userId } = req.user;
    const { expenseSourceId, savedFundId, currency, ...expenseDto } = createExpenseDto;
    const isSingleExpense = !expenseSourceId;

    const { id: currencyId, code: currencyCode } = await this.currenciesService.findOne(currency);
    const savedFund = await this.savedFundsService.findOne(req, savedFundId);

    if (savedFund.amount < expenseDto.amount) throw new BadRequestException('Not enough money');

    if (isSingleExpense) {
      const amount = await this.currenciesService.subtractionOfCurrencyAmounts(
        savedFund.amount,
        expenseDto.amount,
        currencyCode,
        savedFund.currency.code,
      );

      const updateSaveFund = this.prisma.savedFunds.update({
        where: { id: savedFund.id, userId },
        data: { amount },
      });

      const createExpense = this.prisma.expenses.create({
        data: { ...expenseDto, userId, currencyId, savedFundId: savedFund.id },
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
        title: expenseSource.title,
        amount: expenseSource.amount,
        currencyId: expenseSource.currencyId,
        userId: expenseSource.userId,
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
        include: { currency: true },
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
      include: { currency: true },
    });

    if (expense.userId !== userId) throw new ForbiddenException();

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
      include: { currency: true },
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
