import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { CategoriesService } from '@/api/categories/categories.service';
import { QueryHistoryDto } from '@/api/history/dto/query-history.dto';
import { HistoryEntity } from '@/api/history/entities/history.entity';
import { HistoryType } from '@/api/history/enums/history-type.enum';
import { UsersService } from '@/api/users/users.service';
import { FIRST_PAGE, PER_PAGE } from '@/shared/constants';
import { RequestContext } from '@/shared/types';

@Injectable()
export class HistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async findAll(req: RequestContext, query: QueryHistoryDto): Promise<HistoryEntity[]> {
    const { id: userId } = await this.userService.findOne(req, req.user.id);

    const { perPage: pageSize = PER_PAGE, page = FIRST_PAGE, startDate, endDate, savedFundId } = query;

    const skip = page > 0 ? pageSize * (page - 1) : 0;

    const dateCondition =
      startDate && endDate
        ? `AND "dateOfIssue" BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(
            endDate.setHours(23, 59, 59, 999),
          ).toISOString()}'`
        : '';

    const dateTransferCondition =
      startDate && endDate
        ? `AND "createdAt" BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(
            endDate.setHours(23, 59, 59, 999),
          ).toISOString()}'`
        : '';

    const savedFundCondition = query.savedFundId ? `AND "savedFundId" = ${savedFundId}` : '';

    const savedFundTransferCondition = query.savedFundId
      ? `AND "toId" = ${savedFundId} OR "fromId" = ${savedFundId}`
      : '';

    const sql = `
    SELECT * FROM (
      SELECT 'income' as type, "id", "dateOfIssue" FROM "Incomes" WHERE "userId" = ${userId} ${savedFundCondition} ${dateCondition}
      UNION ALL
      SELECT 'expense' as type, "id", "dateOfIssue" FROM "Expenses" WHERE "userId" = ${userId} ${savedFundCondition} ${dateCondition}
      UNION ALL
      SELECT 'transfer' as type, "id", "createdAt" as "dateOfIssue" FROM "Transfers" WHERE "userId" = ${userId} ${savedFundTransferCondition} ${dateTransferCondition}
    ) as history
    ORDER BY "dateOfIssue" DESC
    LIMIT ${pageSize} OFFSET ${skip}
  `;

    const history = (await this.prisma.$queryRaw`${Prisma.raw(sql)}`) as any[];

    return Promise.all(
      history.map(async (item): Promise<HistoryEntity> => {
        if (item.type === HistoryType.Income) {
          const { title, amount, dateOfIssue, currency, category, savedFund } = await this.prisma.incomes.findUnique({
            where: { id: item.id },
            include: { currency: true, savedFund: { select: { source: true } }, category: { select: { name: true } } },
          });

          return {
            type: item.type,
            title,
            amount,
            category,
            currency,
            dateOfIssue,
            source: savedFund.source,
          };
        }

        if (item.type === HistoryType.Expense) {
          const { title, amount, dateOfIssue, currency, category, savedFund } = await this.prisma.expenses.findUnique({
            where: { id: item.id },
            include: { currency: true, savedFund: { select: { source: true } }, category: { select: { name: true } } },
          });

          return {
            type: item.type,
            title,
            category,
            amount,
            currency,
            dateOfIssue,
            source: savedFund.source,
          };
        }

        if (item.type === HistoryType.Transfer) {
          const { amount, createdAt, currency, from, to } = await this.prisma.transfers.findUnique({
            where: { id: item.id },
            include: { currency: true, to: true, from: true },
          });

          return {
            type: item.type,
            title: 'Transfer Funds',
            category: { name: `${from.source} - ${to.source}` },
            amount,
            currency,
            dateOfIssue: createdAt,
            source: from.source,
          };
        }
      }),
    );
  }
}
