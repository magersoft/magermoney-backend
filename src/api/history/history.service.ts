import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { QueryHistoryDto } from '@/api/history/dto/query-history.dto';
import { HistoryEntity } from '@/api/history/entities/history.entity';
import { HistoryType } from '@/api/history/enums/history-type.enum';
import { UsersService } from '@/api/users/users.service';
import { RequestContext } from '@/shared/types';

@Injectable()
export class HistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  public async findAll(req: RequestContext, query: QueryHistoryDto): Promise<HistoryEntity[]> {
    const { id: userId } = await this.userService.findOne(req, req.user.id);

    const { perPage: pageSize, page, startDate, endDate } = query;

    const skip = page > 0 ? pageSize * (page - 1) : 0;

    const dateCondition =
      startDate && endDate ? `AND "dateOfIssue" BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}` : '';

    const sql = `
    SELECT * FROM (
      SELECT 'income' as type, "id", "dateOfIssue" FROM "Incomes" WHERE "userId" = ${userId} ${dateCondition}
      UNION ALL
      SELECT 'expense' as type, "id", "dateOfIssue" FROM "Expenses" WHERE "userId" = ${userId}
      UNION ALL
      SELECT 'transfer' as type, "id", "createdAt" as "dateOfIssue" FROM "Transfers" WHERE "userId" = ${userId}
    ) as history
    ORDER BY "dateOfIssue" DESC
    LIMIT ${pageSize} OFFSET ${skip}
  `;

    const history = (await this.prisma.$queryRaw`${Prisma.raw(sql)}`) as any[];

    return Promise.all(
      history.map(async (item): Promise<HistoryEntity> => {
        if (item.type === HistoryType.Income) {
          const { title, amount, currency, dateOfIssue } = await this.prisma.incomes.findUnique({
            where: { id: item.id },
            include: { currency: true },
          });

          return {
            type: item.type,
            title,
            amount,
            currency,
            dateOfIssue,
          };
        }

        if (item.type === HistoryType.Expense) {
          const { title, amount, currency, dateOfIssue } = await this.prisma.expenses.findUnique({
            where: { id: item.id },
            include: { currency: true },
          });

          return {
            type: item.type,
            title,
            amount,
            currency,
            dateOfIssue,
          };
        }

        if (item.type === HistoryType.Transfer) {
          const { amount, createdAt, currency, from, to } = await this.prisma.transfers.findUnique({
            where: { id: item.id },
            include: { currency: true, to: true, from: true },
          });

          return {
            type: item.type,
            title: `${from.source} - ${to.source}`,
            amount,
            currency,
            dateOfIssue: createdAt,
          };
        }
      }),
    );
  }
}
