import { User } from '@prisma/client'
import { UserResponseDTO } from './user.dto'

export const toUserResponseDTO = (user: User): UserResponseDTO => {
  const {
    id,
    role,
    employee_id,
    email,
    first_name,
    middle_name,
    last_name,
    position,
    manager,
    cluster,
    meal_type_id,
    is_verified,
    is_active,
    created_at,
    updated_at
  } = user

  return {
    id,
    role,
    employee_id,
    email,
    first_name,
    middle_name,
    last_name,
    position,
    manager,
    cluster,
    meal_type_id,
    is_verified,
    is_active,
    created_at,
    updated_at,
  }
}
