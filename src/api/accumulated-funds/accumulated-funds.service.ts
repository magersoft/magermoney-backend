import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { RequestContext } from '@/shared/types';

import { CreateAccumulatedFundDto } from './dto/create-accumulated-fund.dto';
import { UpdateAccumulatedFundDto } from './dto/update-accumulated-fund.dto';

@Injectable()
export class AccumulatedFundsService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(req: RequestContext, createAccumulatedFundDto: CreateAccumulatedFundDto) {
    const { id: userId } = req.user;

    return await this.prisma.accumulatedFunds.create({
      data: { ...createAccumulatedFundDto, userId },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.accumulatedFunds.findMany({
      where: {
        userId,
      },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const accumulatedFund = await this.prisma.accumulatedFunds.findUnique({ where: { id } });

    if (accumulatedFund.userId !== userId) throw new ForbiddenException();

    return accumulatedFund;
  }

  public async update(req: RequestContext, id: number, updateAccumulatedFundDto: UpdateAccumulatedFundDto) {
    const { id: userId } = req.user;
    const accumulatedFund = await this.findOne(req, id);

    return await this.prisma.accumulatedFunds.update({
      where: {
        id: accumulatedFund.id,
        userId,
      },
      data: updateAccumulatedFundDto,
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const accumulatedFund = await this.findOne(req, id);

    return await this.prisma.accumulatedFunds.delete({ where: { id: accumulatedFund.id, userId } });
  }
}
