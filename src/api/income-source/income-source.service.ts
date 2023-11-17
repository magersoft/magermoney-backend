import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { RequestContext } from '@/shared/types';

import { CreateIncomeSourceDto } from './dto/create-income-source.dto';
import { UpdateIncomeSourceDto } from './dto/update-income-source.dto';

@Injectable()
export class IncomeSourceService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(req: RequestContext, createIncomeSourceDto: CreateIncomeSourceDto) {
    const { id: userId } = req.user;

    return await this.prisma.incomeSource.create({
      data: { ...createIncomeSourceDto, userId },
    });
  }

  public async findAll(req: RequestContext) {
    const { id: userId } = req.user;

    return await this.prisma.incomeSource.findMany({
      where: {
        userId,
      },
    });
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    const incomeSource = await this.prisma.incomeSource.findUnique({ where: { id } });

    if (incomeSource.userId !== userId) throw new ForbiddenException();

    return incomeSource;
  }

  public async update(req: RequestContext, id: number, updateIncomeSourceDto: UpdateIncomeSourceDto) {
    const { id: userId } = req.user;
    const incomeSource = await this.findOne(req, id);

    return await this.prisma.incomeSource.update({
      where: {
        id: incomeSource.id,
        userId,
      },
      data: updateIncomeSourceDto,
    });
  }

  public async remove(req: RequestContext, id: number) {
    const { id: userId } = req.user;
    const incomeSource = await this.findOne(req, id);

    return await this.prisma.incomeSource.delete({ where: { id: incomeSource.id, userId } });
  }
}
