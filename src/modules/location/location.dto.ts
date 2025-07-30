export interface LocationResponseDTO {
    id: number
    name: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export interface LocationResponsePaginatedDTO {
    data: LocationResponseDTO[]
    page: number
    totalPages: number
    totalRecords: number
}

export interface CreateLocationDTO {
    name: string
}

export interface UpdateLocationDTO {
    id: number
    name: string
    is_active: boolean
}