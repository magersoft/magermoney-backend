import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { RequestContext } from '@/shared/types';

import { CreateMonthlyExpenseDto } from './dto/create-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dto/update-monthly-expense.dto';

@Injectable()
export class MonthlyExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  public async create(req: RequestContext, createMonthlyExpenseDto: CreateMonthlyExpenseDto) {
    const { id: userId } = req.user;
    const { currency, ...monthlyExpenseDto } = createMonthlyExpenseDto;
    const { id: currencyId } = await this.currenciesService.findOne(currency);

    return await this.prisma.monthlyExpense.create({
      data: { ...monthlyExpenseDto, userId, currencyId },
      include: { currency: true },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.monthlyExpense.findMany({
      where: {
        userId,
      },
      include: { currency: true },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const monthlyExpense = await this.prisma.monthlyExpense.findUniqueOrThrow({
      where: { id },
      include: { currency: true },
    });

    if (monthlyExpense.userId !== userId) throw new ForbiddenException();

    return monthlyExpense;
  }

  public async update(req: RequestContext, id: number, updateMonthlyExpenseDto: UpdateMonthlyExpenseDto) {
    const { id: userId } = req.user;
    const monthlyExpense = await this.findOne(req, id);

    const { currency, ...monthlyExpenseDto } = updateMonthlyExpenseDto;
    const { id: currencyId } = await this.currenciesService.findOne(currency);

    return await this.prisma.monthlyExpense.update({
      where: {
        id: monthlyExpense.id,
        userId,
      },
      data: { ...monthlyExpenseDto, currencyId },
      include: { currency: true },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const monthlyExpense = await this.findOne(req, id);

    return await this.prisma.monthlyExpense.delete({
      where: { id: monthlyExpense.id, userId },
      include: { currency: true },
    });
  }
}
