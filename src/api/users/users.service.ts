import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { RequestContext } from '@/shared/types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({ data: createUserDto });
  }

  public async findAll() {
    return await this.prisma.users.findMany();
  }

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    if (userId !== id) throw new ForbiddenException(`You don't have permission to access this resource`);

    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  public async findOneByEmailOrPhone(email: string, phone: string) {
    return await this.prisma.users.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  }

  public async update(req: RequestContext, id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(req, id);
    return await this.prisma.users.update({ where: { id: user.id }, data: updateUserDto });
  }

  public async remove(req: RequestContext, id: number) {
    const user = await this.findOne(req, id);
    return await this.prisma.users.delete({ where: { id: user.id } });
  }
}
