import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async findOneByEmailOrPhone(email: string, phone: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.prisma.user.update({ where: { id: user.id }, data: updateUserDto });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
