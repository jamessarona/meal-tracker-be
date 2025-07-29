import prisma from '../../prisma/client';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

export class UserRepository {
  findPaginated(skip: number, take: number) {
    return prisma.user.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
    });
  }

  countAll() {
    return prisma.user.count();
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