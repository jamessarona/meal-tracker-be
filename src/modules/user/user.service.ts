import { inject, injectable } from 'tsyringe';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO, UserResponsePaginatedDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { toUserResponseDTO } from './user.mapper';
import { HashService } from '../../core/services/security/hash.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { LogAction } from '@prisma/client';
import prisma from '../../prisma/client';
import { HttpError } from '../../utils/httpError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepo: UserRepository,
    @inject('HashService') private hashService: HashService,
    @inject('AuditLogService') private auditLogService: AuditLogService,
  ) {}

  private static readonly loggableFields = [
    'email',
    'first_name',
    'last_name',
    'position',
    'cluster',
  ];

  async getUsersPaginated(page: number, limit: number, search?: string): Promise<UserResponsePaginatedDTO>{
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepo.findPaginated(skip, limit, search),
      this.userRepo.countAll(search),
    ]);

    return {
      data: users.map(toUserResponseDTO),
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  }

  async getUserById(id: number): Promise<UserResponseDTO | null> {
    const user = await this.userRepo.findById(id);
    return user ? toUserResponseDTO(user) : null;
  }

  async createUser(data: CreateUserDTO, currentUserId: number): Promise<UserResponseDTO> {
    const existingUser = await this.userRepo.findByEmployeeId(data.employee_id);
    if (existingUser)
      throw new HttpError(`User with employee_id ${data.employee_id} already exists.`, StatusCodes.CONFLICT);

    const hashedPassword = await this.hashService.hash(data.password);

    const result = await prisma.$transaction(async (tx) => {
      const repo = new UserRepository(tx);

      const user = await repo.create({
        ...data,
        password: hashedPassword,
      });

      const changedFields = this.auditLogService.generateCreateFields(data, UserService.loggableFields);
      await this.auditLogService.log({
        action: LogAction.CREATE,
        objectType: 'User',
        objectId: user.id,
        actorUserId: currentUserId,
        changedFields,
        tx,
      });

      return user;
    });

    return toUserResponseDTO(result);
  }

  async updateUser(id: number, data: UpdateUserDTO, currentUserId: number): Promise<UserResponseDTO> {
    const oldUser = await this.userRepo.findById(id);
    if (!oldUser) {
      throw new HttpError(`User with id ${id} not found.`, StatusCodes.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (tx) => {
      const repo = new UserRepository(tx);

      const updatedUser = await repo.update(id, data);

      const changedFields = this.auditLogService.getChangedFields(
        oldUser,
        data,
        UserService.loggableFields
      );

      if (Object.keys(changedFields).length > 0) {
        await this.auditLogService.log({
          action: LogAction.UPDATE,
          objectType: 'User',
          objectId: id,
          actorUserId: currentUserId,
          changedFields,
          tx,
        });
      }

      return updatedUser;
    });

    return toUserResponseDTO(result);
  }

  async deleteUser(id: number, currentUserId: number): Promise<void> {
    const existing = await this.userRepo.findById(id);

    await prisma.$transaction(async (tx) => {
      const repo = new UserRepository(tx);

      await repo.delete(id);

      if (existing) {
        await this.auditLogService.log({
          action: LogAction.DELETE,
          objectType: 'User',
          objectId: id,
          actorUserId: currentUserId,
          tx,
        });
      }
    });
  }
}