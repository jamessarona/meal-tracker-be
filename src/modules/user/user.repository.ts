import prisma from '../../prisma/client';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

export class UserRepository {
  findPaginated(skip: number, take: number, search?: string) {
    return prisma.user.findMany({
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
    return prisma.user.count({
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
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmployeeId(employee_id: number) {
    return prisma.user.findUnique({ where: { employee_id }, },);
  }

  create(data: CreateUserDTO & { password: string }) {
    return prisma.user.create({ data },);
  }

  update(id: number, data: Partial<UpdateUserDTO>) {
    return prisma.user.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}