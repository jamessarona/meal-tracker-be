import { Prisma, PrismaClient } from "@prisma/client";
import { CreateMealTypeDTO, UpdateMealTypeDTO } from "./meal-type.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class MealTypeRepository {
  constructor(
    @inject("PrismaClient") private prisma: PrismaClient | Prisma.TransactionClient
  ) {}

  findPaginated(skip: number, take: number, search?: string) {
    return this.prisma.mealType.findMany({
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
    return this.prisma.mealType.count({
      where: search
        ? {
            name: { contains: search, mode: 'insensitive' }
          }
        : undefined,
    });
  }

  findById(id: number) {
    return this.prisma.mealType.findUnique({ where: { id } });
  }

  create(data: CreateMealTypeDTO & { is_active: boolean }) {
    return this.prisma.mealType.create({ data });
  }

  update(id: number, data: Partial<UpdateMealTypeDTO>) {
    return this.prisma.mealType.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.mealType.delete({ where: { id } });
  }
}