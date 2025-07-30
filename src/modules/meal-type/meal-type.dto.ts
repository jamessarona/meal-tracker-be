export interface MealTypeResponseDTO {
    id: number
    name: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export interface MealTypeResponsePaginatedDTO {
    data: MealTypeResponseDTO[]
    page: number
    totalPages: number
    totalRecords: number
}

export interface CreateMealTypeDTO {
    name: string
}

export interface UpdateMealTypeDTO {
    id: number
    name: string
    is_active: boolean
}