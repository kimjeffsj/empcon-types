import { BaseEntity, Status, UserRole } from "../common";

// Database Enums (from Prisma schema)
export type PayType = "HOURLY" | "SALARY";

export type OvertimeStatus = "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";

export type PayPeriodStatus = "OPEN" | "PROCESSING" | "COMPLETED" | "PAID";

export type LeaveStatus = "PENDING" | "APPROVED" | "DENIED" | "CANCELLED";

export type NotificationType =
  | "OVERTIME_REQUEST"
  | "OVERTIME_APPROVED"
  | "OVERTIME_DENIED"
  | "LEAVE_REQUEST"
  | "LEAVE_APPROVED"
  | "LEAVE_DENIED"
  | "SCHEDULE_CHANGE"
  | "PAYROLL_READY"
  | "SYSTEM_ALERT";

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
  payType: PayType;
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
