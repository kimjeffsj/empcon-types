// Department domain types

// Department Request interfaces
export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentRequest
  extends Partial<CreateDepartmentRequest> {}

// Department Response interface
export interface DepartmentResponse {
  id: string;
  name: string;
  description: string | null;
  managerId: string | null;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}