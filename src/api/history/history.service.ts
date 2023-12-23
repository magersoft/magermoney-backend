import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { QueryHistoryDto } from '@/api/history/dto/query-history.dto';
import { HistoryEntity } from '@/api/history/entities/history.entity';
import { HistoryType } from '@/api/history/enums/history-type.enum';
import { RequestContext } from '@/shared/types';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(req: RequestContext, query: QueryHistoryDto): Promise<HistoryEntity[]> {
    const { id: userId } = req.user;
    const { perPage: pageSize, page } = query;

    const skip = page > 0 ? pageSize * (page - 1) : 0;

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        incomes: {
          take: pageSize,
          skip: skip,
          include: { currency: true },
          orderBy: {
            dateOfIssue: 'desc',
          },
        },
        expenses: {
          take: pageSize,
          skip: skip,
          include: { currency: true },
          orderBy: {
            dateOfIssue: 'desc',
          },
        },
        transfers: {
          take: pageSize,
          skip: skip,
          include: { currency: true, to: true, from: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const history: HistoryEntity[] = [];

    user.incomes.forEach((income) => {
      history.push({
        type: HistoryType.Income,
        title: income.title,
        amount: income.amount,
        currency: income.currency,
        dateOfIssue: income.dateOfIssue,
      });
    });

    user.expenses.forEach((expense) => {
      history.push({
        type: HistoryType.Expense,
        title: expense.title,
        amount: expense.amount,
        currency: expense.currency,
        dateOfIssue: expense.dateOfIssue,
      });
    });

    user.transfers.forEach((transfer) => {
      history.push({
        type: HistoryType.Transfer,
        title: `${transfer.from.source} - ${transfer.to.source}`,
        amount: transfer.amount,
        currency: transfer.currency,
        dateOfIssue: transfer.createdAt,
      });
    });

    history.sort((a, b) => b.dateOfIssue.getTime() - a.dateOfIssue.getTime());

    return history;
  }
}
