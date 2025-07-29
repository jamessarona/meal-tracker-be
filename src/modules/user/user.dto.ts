import { Role } from "@prisma/client"

export interface UserResponseDTO {
  id: number
  role: Role
  employee_id: number
  email: string
  first_name: string
  middle_name?: string | null
  last_name: string
  position?: string | null
  manager?: string | null
  cluster?: string | null
  meal_type_id?: number | null
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserDTO {
  role?: Role
  employee_id: number
  email: string
  password: string
  first_name: string
  middle_name?: string | null
  last_name: string
  position?: string | null
  manager?: string | null
  cluster?: string | null
  meal_type_id?: number | null
}

export interface UpdateUserDTO {
  email: string
  first_name: string
  middle_name: string | null
  last_name: string
  position?: string | null
  manager?: string | null
  cluster?: string | null
  meal_type_id?: number | null
}
