import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { IncomeSourcesService } from '@/api/income-sources/income-sources.service';
import { RequestContext } from '@/shared/types';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly incomeSourcesService: IncomeSourcesService,
  ) {}

  public async create(req: RequestContext, createIncomeDto: CreateIncomeDto) {
    const { id: userId } = req.user;
    const { incomeSourceId, currency, ...incomeDto } = createIncomeDto;

    const { id: currencyId } = await this.currenciesService.findOne(currency);

    if (!incomeSourceId) {
      return await this.prisma.incomes.create({
        data: { ...incomeDto, userId, currencyId },
      });
    }

    const incomeSource = await this.incomeSourcesService.findOne(req, incomeSourceId);

    return await this.prisma.incomes.create({
      data: {
        title: incomeSource.title,
        amount: incomeSource.amount,
        currencyId: incomeSource.currencyId,
        userId: incomeSource.userId,
        dateOfIssue: incomeDto.dateOfIssue,
      },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.incomes.findMany({
      where: {
        userId,
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

    return await this.prisma.incomes.delete({
      where: { id: income.id, userId },
      include: { currency: true },
    });
  }
}
