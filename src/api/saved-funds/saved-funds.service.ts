import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { RequestContext } from '@/shared/types';

import { CreateSavedFundDto } from './dto/create-saved-fund.dto';
import { UpdateSavedFundDto } from './dto/update-saved-fund.dto';

@Injectable()
export class SavedFundsService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(req: RequestContext, createSavedFundDto: CreateSavedFundDto) {
    const { id: userId } = req.user;

    return await this.prisma.savedFunds.create({
      data: { ...createSavedFundDto, userId },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.savedFunds.findMany({
      where: {
        userId,
      },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const savedFund = await this.prisma.savedFunds.findUnique({ where: { id } });

    if (savedFund.userId !== userId) throw new ForbiddenException();

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
      data: updateSavedFundDto,
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const savedFund = await this.findOne(req, id);

    return await this.prisma.savedFunds.delete({ where: { id: savedFund.id, userId } });
  }
}
