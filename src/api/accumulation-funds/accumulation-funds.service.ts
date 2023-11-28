import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { RequestContext } from '@/shared/types';

import { CreateAccumulationFundDto } from './dto/create-accumulation-fund.dto';
import { UpdateAccumulationFundDto } from './dto/update-accumulation-fund.dto';

@Injectable()
export class AccumulationFundsService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(req: RequestContext, createAccumulationFundDto: CreateAccumulationFundDto) {
    const { id: userId } = req.user;

    return await this.prisma.accumulationFunds.create({
      data: { ...createAccumulationFundDto, userId },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.accumulationFunds.findMany({
      where: {
        userId,
      },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const accumulationFund = await this.prisma.accumulationFunds.findUnique({ where: { id } });

    if (accumulationFund.userId !== userId) throw new ForbiddenException();

    return accumulationFund;
  }

  public async update(req: RequestContext, id: number, updateAccumulationFundDto: UpdateAccumulationFundDto) {
    const { id: userId } = req.user;
    const accumulationFund = await this.findOne(req, id);

    return await this.prisma.accumulationFunds.update({
      where: {
        id: accumulationFund.id,
        userId,
      },
      data: updateAccumulationFundDto,
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const accumulationFund = await this.findOne(req, id);

    return await this.prisma.accumulationFunds.delete({ where: { id: accumulationFund.id, userId } });
  }
}
