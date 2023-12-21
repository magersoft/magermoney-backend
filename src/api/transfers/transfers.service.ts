import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CurrenciesService } from '@/api/currencies/currencies.service';
import { SavedFundsService } from '@/api/saved-funds/saved-funds.service';
import { RequestContext } from '@/shared/types';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly savedFundsService: SavedFundsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  public async create(req: RequestContext, createTransferDto: CreateTransferDto) {
    const { id: userId } = req.user;
    const { toId, fromId, amount, currency: currencyCode } = createTransferDto;

    const currency = await this.currenciesService.findOne(currencyCode);

    const savedFundFrom = await this.savedFundsService.findOne(req, fromId);
    const savedFundTo = await this.savedFundsService.findOne(req, toId);

    const decreaseAmount = await this.currenciesService.subtractionOfCurrencyAmounts(
      savedFundFrom.amount,
      amount,
      currency.code,
      savedFundFrom.currency.code,
    );

    const increaseAmount = await this.currenciesService.additionOfCurrencyAmounts(
      savedFundTo.amount,
      amount,
      currency.code,
      savedFundTo.currency.code,
    );

    if (decreaseAmount > savedFundFrom.amount) throw new BadRequestException('Not enough money');

    const updateSavedFundFrom = this.prisma.savedFunds.update({
      where: { id: savedFundFrom.id, userId },
      data: { amount: decreaseAmount },
    });

    const updateSavedFundTo = this.prisma.savedFunds.update({
      where: { id: savedFundTo.id, userId },
      data: { amount: increaseAmount },
    });

    const createTransfer = this.prisma.transfers.create({
      data: {
        amount,
        fromId: savedFundFrom.id,
        toId: savedFundTo.id,
        currencyId: currency.id,
        userId,
      },
    });

    const [createdTransfer] = await this.prisma.$transaction([createTransfer, updateSavedFundFrom, updateSavedFundTo]);

    return createdTransfer;
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.transfers.findMany({
      where: { userId },
      include: { currency: true },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const transfer = await this.prisma.transfers.findUniqueOrThrow({
      where: { id },
      include: { currency: true },
    });

    if (transfer.userId !== userId) throw new ForbiddenException(`You don't have permission to access this resource`);

    return transfer;
  }

  public async update(req: RequestContext, id: number, updateTransferDto: UpdateTransferDto) {
    const { id: userId } = req.user;
    const transfer = await this.findOne(req, id);

    return await this.prisma.transfers.update({
      where: {
        id: transfer.id,
        userId,
      },
      data: { ...updateTransferDto },
      include: { currency: true },
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const transfer = await this.findOne(req, id);

    return await this.prisma.transfers.delete({
      where: { id: transfer.id, userId },
    });
  }
}
