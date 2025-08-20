export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "TERMINATED";
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
