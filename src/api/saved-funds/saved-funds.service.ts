import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { UpdateOrdersSavedFundsDto } from '@/api/saved-funds/dto/update-orders-saved-funds.dto';
import { RequestContext } from '@/shared/types';

import { CreateSavedFundDto } from './dto/create-saved-fund.dto';
import { UpdateSavedFundDto } from './dto/update-saved-fund.dto';

@Injectable()
export class SavedFundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  public async create(req: RequestContext, createSavedFundDto: CreateSavedFundDto) {
    const { id: userId } = req.user;
    const { currency, ...savedFundDto } = createSavedFundDto;

    const { id: currencyId } = await this.currenciesService.findOne(currency);

    return await this.prisma.savedFunds.create({
      data: { ...savedFundDto, userId, currencyId },
      include: { currency: true },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.savedFunds.findMany({
      where: {
        userId,
      },
      include: { currency: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const savedFund = await this.prisma.savedFunds.findUniqueOrThrow({
      where: { id },
      include: { currency: true },
    });

    if (savedFund.userId !== userId) throw new ForbiddenException(`You don't have permission to access this resource`);

    return savedFund;
  }

  public async update(req: RequestContext, id: number, updateSavedFundDto: UpdateSavedFundDto) {
    const { id: userId } = req.user;
    const savedFund = await this.findOne(req, id);

    return await this.prisma.savedFunds.update({
      where: {
        id: savedFund.id,
        userId,
      },
      data: { ...updateSavedFundDto },
      include: { currency: true },
    });
  }

  public async updateOrders(req: RequestContext, updateOrdersSavedFundsDto: UpdateOrdersSavedFundsDto) {
    const { id: userId } = req.user;
    const { ids } = updateOrdersSavedFundsDto;

    for (let i = 0; i < ids.length; i++) {
      const savedFund = await this.findOne(req, +ids[i]);

      await this.prisma.savedFunds.update({
        where: {
          id: savedFund.id,
          userId,
        },
        data: { order: i },
        include: { currency: true },
      });
    }

    return await this.findAll(req);
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const savedFund = await this.findOne(req, id);

    return await this.prisma.savedFunds.delete({
      where: { id: savedFund.id, userId },
      include: { currency: true },
    });
  }
}
