import { Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { CreateLocationDTO, UpdateLocationDTO } from "./location.dto";

@injectable()
export class LocationRepository {
  constructor(
    @inject("PrismaClient") private prisma: PrismaClient | Prisma.TransactionClient
  ) {}

  findPaginated(skip: number, take: number, search?: string) {
    return this.prisma.location.findMany({
      skip,
      take,
      where: search
        ? {
            name: { contains: search, mode: 'insensitive' }
          }
        : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  countAll(search?: string) {
    return this.prisma.location.count({
      where: search
        ? {
            name: { contains: search, mode: 'insensitive' }
          }
        : undefined,
    });
  }

  findById(id: number) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  create(data: CreateLocationDTO & { is_active: boolean }) {
    return this.prisma.location.create({ data });
  }

  update(id: number, data: Partial<UpdateLocationDTO>) {
    return this.prisma.location.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.location.delete({ where: { id } });
  }
}