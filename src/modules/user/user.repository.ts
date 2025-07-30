import type { PrismaClient, Prisma } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserRepository {
  constructor(
    @inject("PrismaClient") private prisma: PrismaClient | Prisma.TransactionClient
  ) {}

  findPaginated(skip: number, take: number, search?: string) {
    return this.prisma.user.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { employee_id: { equals: isNaN(Number(search)) ? undefined : Number(search) } },
            ],
          }
        : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  countAll(search?: string) {
    return this.prisma.user.count({
      where: search
        ? {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { employee_id: { equals: isNaN(Number(search)) ? undefined : Number(search) } },
            ],
          }
        : undefined,
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmployeeId(employee_id: number) {
    return this.prisma.user.findUnique({ where: { employee_id } });
  }

  create(data: CreateUserDTO & { password: string }) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data: Partial<UpdateUserDTO>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}