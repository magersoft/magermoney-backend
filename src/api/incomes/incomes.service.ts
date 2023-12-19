import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { QueryIncomesDto } from '@/api/incomes/dto/query-incomes.dto';
import { IncomeEntity } from '@/api/incomes/entities/income.entity';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { usePaginator } from '@/shared/features';
import { RequestContext } from '@/shared/types';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
    private readonly savedFundsService: SavedFundsService,
  ) {}

  public async create(req: RequestContext, createIncomeDto: CreateIncomeDto) {
    const { id: userId } = req.user;
    const { incomeSourceId, savedFundId, currency, ...incomeDto } = createIncomeDto;
    const isSingleIncome = !incomeSourceId;

    const { id: currencyId, code: currencyCode } = await this.currenciesService.findOne(currency);
    const savedFund = await this.savedFundsService.findOne(req, savedFundId);

    if (isSingleIncome) {
      const amount = await this.currenciesService.additionOfCurrencyAmounts(
        savedFund.amount,
        incomeDto.amount,
        currencyCode,
        savedFund.currency.code,
      );

      const updateSaveFund = this.prisma.savedFunds.update({
        where: { id: savedFund.id, userId },
        data: { amount },
      });

      const createIncome = this.prisma.incomes.create({
        data: { ...incomeDto, userId, currencyId, savedFundId: savedFund.id },
      });

      const [createdIncome] = await this.prisma.$transaction([createIncome, updateSaveFund]);

      return createdIncome;
    }

    const incomeSource = await this.incomeSourcesService.findOne(req, incomeSourceId);

    const amount = await this.currenciesService.additionOfCurrencyAmounts(
      savedFund.amount,
      incomeDto.amount,
      incomeSource.currency.code,
      savedFund.currency.code,
    );

    const updateSaveFund = this.prisma.savedFunds.update({
      where: { id: savedFund.id, userId },
      data: { amount },
    });

    const createIncome = this.prisma.incomes.create({
      data: {
        title: incomeSource.title,
        amount: incomeSource.amount,
        currencyId: incomeSource.currencyId,
        userId: incomeSource.userId,
        savedFundId: savedFund.id,
        incomeSourceId: incomeSource.id,
        dateOfIssue: incomeDto.dateOfIssue,
      },
    });

    const [createdIncome] = await this.prisma.$transaction([createIncome, updateSaveFund]);

    return createdIncome;
  }

  public async findAll(req: RequestContext, query: QueryIncomesDto) {
    const { id: userId } = req.user;
    const { perPage, page, startDate, endDate } = query;

    const { paginate } = usePaginator({ perPage, page });

    return await paginate<IncomeEntity, Prisma.IncomesFindManyArgs>(
      this.prisma.incomes,
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

    return await this.prisma.incomes.findMany({
      where: {
        userId,
        dateOfIssue: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: { currency: true },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const income = await this.prisma.incomes.findUniqueOrThrow({
      where: { id },
      include: { currency: true },
    });

    if (income.userId !== userId) throw new ForbiddenException();

    return income;
  }

  public async update(req: RequestContext, id: number, updateIncomeDto: UpdateIncomeDto) {
    const { id: userId } = req.user;
    const income = await this.findOne(req, id);

    return await this.prisma.incomes.update({
      where: {
        id: income.id,
        userId,
      },
      data: { ...updateIncomeDto },
      include: { currency: true },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const income = await this.findOne(req, id);
    const savedFund = await this.savedFundsService.findOne(req, income.savedFundId);

    const amount = await this.currenciesService.subtractionOfCurrencyAmounts(
      savedFund.amount,
      income.amount,
      income.currency.code,
      savedFund.currency.code,
    );

    const updateSaveFund = this.prisma.savedFunds.update({
      where: { id: savedFund.id, userId },
      data: { amount },
    });

    const removeIncome = this.prisma.incomes.delete({
      where: {
        id: income.id,
        userId,
      },
    });

    const [removedIncome] = await this.prisma.$transaction([removeIncome, updateSaveFund]);

    return removedIncome;
  }
}
