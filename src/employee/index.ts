import { UserRole } from "../common";
import { Department, Position } from "../database";

// Employee Status
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "TERMINATED" | "ON_LEAVE";

// Employee interface extending EmployeeProfile
export interface Employee {
  id: string;
  userId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: Date;
  hireDate: Date;
  payRate: number;
  payType: "HOURLY" | "SALARY";
  status: EmployeeStatus;
  departmentId: string;
  positionId: string;
  managerId?: string;
  sinEncrypted: string;
  profilePicture?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
  department?: Department;
  position?: Position;
  manager?: Employee;
}

// Employee creation/update interfaces
export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  hireDate: string;
  payRate?: number;
  payType: "HOURLY" | "SALARY";
  role?: UserRole;
  departmentId: string;
  positionId: string;
  managerId?: string;
  sin: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  status?: EmployeeStatus;
}

export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  dateOfBirth: string;
  hireDate: string;
  payRate: number;
  payType: "HOURLY" | "SALARY";
  status: EmployeeStatus;
  departmentId: string;
  positionId: string;
  managerId?: string;
  sin?: string; // Only included via separate API endpoint
  sinMasked?: string; // Masked SIN (xxx-xxx-123) for display
  hasSIN?: boolean; // Indicates if SIN exists (for UI purposes)
  profilePicture?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
  department?: {
    id: string;
    name: string;
  };
  position?: {
    id: string;
    title: string;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Department and Position requests
export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentRequest
  extends Partial<CreateDepartmentRequest> {}

export interface CreatePositionRequest {
  title: string;
  departmentId: string;
  description?: string;
}

export interface UpdatePositionRequest extends Partial<CreatePositionRequest> {}

// List interfaces
export interface EmployeeListRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployeeStatus;
  departmentId?: string;
  positionId?: string;
  managerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
