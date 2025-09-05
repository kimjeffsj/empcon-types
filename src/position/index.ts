// Position domain types

// Position Request interfaces
export interface CreatePositionRequest {
  title: string;
  departmentId: string;
  description?: string;
}

export interface UpdatePositionRequest extends Partial<CreatePositionRequest> {}

// Position Response interface
export interface PositionResponse {
  id: string;
  title: string;
  departmentId: string;
  description: string | null;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
  };
}