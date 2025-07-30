import { inject, injectable } from "tsyringe";
import { MealTypeRepository } from "./meal-type.repository";
import { AuditLogService } from "../audit-log/audit-log.service";
import { MealTypeResponseDTO, MealTypeResponsePaginatedDTO, UpdateMealTypeDTO } from "./meal-type.dto";
import prisma from "../../prisma/client";
import { LogAction } from "@prisma/client";
import { HttpError } from "../../utils/httpError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class MealTypeService {
  constructor(
    @inject('MealTypeRepository') private mealTypeRepo: MealTypeRepository,
    @inject('AuditLogService') private auditLogService: AuditLogService,
  ) {}

  private static readonly loggableFields = ['name', 'is_active'];

  async getMealTypesPaginated(page: number, limit: number, search?: string): Promise<MealTypeResponsePaginatedDTO> {
    const skip = (page - 1) * limit;

    const [mealTypes, total] = await Promise.all([
      this.mealTypeRepo.findPaginated(skip, limit, search),
      this.mealTypeRepo.countAll(search),
    ]);

    return {
      data: mealTypes,
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  }

  async getMealTypeById(id: number): Promise<MealTypeResponseDTO | null> {
    const mealType = await this.mealTypeRepo.findById(id);
    return mealType ? mealType : null;
  }

  async createMealType(data: { name: string }, currentUserId: number): Promise<MealTypeResponseDTO> {
    const result = await prisma.$transaction(async (transactionClient) => {
      const transMealTypeRepo = new MealTypeRepository(transactionClient);

      const mealType = await transMealTypeRepo.create({
        ...data,
        is_active: true,
      });

      const changedFields = this.auditLogService.generateCreateFields(
        mealType,
        MealTypeService.loggableFields
      );

      await this.auditLogService.log({
        action: LogAction.CREATE,
        objectType: 'MealType',
        objectId: mealType.id,
        actorUserId: currentUserId,
        changedFields,
        transactionClient,
      });

      return mealType;
    });

    return result;
  }

  async updateMealType(id: number, data: Partial<UpdateMealTypeDTO>, currentUserId: number): Promise<MealTypeResponseDTO> {
    const oldMealType = await this.mealTypeRepo.findById(id);
    if (!oldMealType) {
      throw new HttpError(`Meal type with id ${id} not found.`, StatusCodes.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (transactionClient) => {
      const transMealTypeRepo = new MealTypeRepository(transactionClient);

      const updatedMealType = await transMealTypeRepo.update(id, data);

      const changedFields = this.auditLogService.getChangedFields(
        oldMealType,
        updatedMealType,
        MealTypeService.loggableFields
      );

      await this.auditLogService.log({
        action: LogAction.UPDATE,
        objectType: 'MealType',
        objectId: id,
        actorUserId: currentUserId,
        changedFields,
        transactionClient
      });

      return updatedMealType;
    });

    return result;
  }

  async deleteMealType(id: number, currentUserId: number): Promise<void> {
    const mealType = await this.mealTypeRepo.findById(id);
    if (!mealType) {
      throw new HttpError(`Meal type with id ${id} not found.`, StatusCodes.NOT_FOUND);
    }

    await prisma.$transaction(async (transactionClient) => {
      const transMealTypeRepo = new MealTypeRepository(transactionClient);

      await transMealTypeRepo.delete(id);

      await this.auditLogService.log({
        action: LogAction.DELETE,
        objectType: 'MealType',
        objectId: id,
        actorUserId: currentUserId,
        changedFields: {},
        transactionClient
      });
    });
  }
}