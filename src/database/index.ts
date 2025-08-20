import { BaseEntity, Status, UserRole } from "../common";

export interface User extends BaseEntity {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: Status;
  lastLogin?: Date;
  failedLoginAttempts: number;
  accountLockedUntil?: Date;
  tempPasswordHash?: string;
  tempPasswordExpiresAt?: Date;
  passwordResetRequired: boolean;
}

export interface EmployeeProfile extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sinEncrypted: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  dob: Date;
  hireDate: Date;
  payRate: number;
  payType: "HOURLY" | "SALARY";
  departmentId: string;
  positionId: string;
  status: Status;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface Department extends BaseEntity {
  name: string;
  description?: string;
  createdBy: string;
}

export interface Position extends BaseEntity {
  departmentId: string;
  title: string;
  description?: string;
  createdBy: string;
}
