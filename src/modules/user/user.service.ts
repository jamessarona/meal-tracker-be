import { inject, injectable } from 'tsyringe';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { toUserResponseDTO } from './user.mapper';
import { HashService } from '../../core/services/security/hash.service';

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("HashService") private hashService: HashService,
  ) {}

  async getUsersPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepo.findPaginated(skip, limit),
      this.userRepo.countAll(),
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

  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    const hashedPassword = await this.hashService.hash(data.password);
    const user = await this.userRepo.create({ ...data, password: hashedPassword });
    return toUserResponseDTO(user);
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const updateData = { ...data };
    
    const updatedUser = await this.userRepo.update(id, updateData);
    return toUserResponseDTO(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}