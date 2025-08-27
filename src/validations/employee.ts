import { z } from 'zod';

// Employee validation schemas
export const createEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  middleName: z.string().max(50, "Middle name must be less than 50 characters").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  addressLine1: z.string().min(1, "Address line 1 is required").max(100, "Address line 1 must be less than 100 characters"),
  addressLine2: z.string().max(100, "Address line 2 must be less than 100 characters").optional(),
  city: z.string().min(1, "City is required").max(50, "City must be less than 50 characters"),
  province: z.string().length(2, "Province must be 2 characters"),
  postalCode: z.string().min(6, "Postal code must be 6 characters").max(7, "Postal code must be 6-7 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  hireDate: z.string().min(1, "Hire date is required"),
  payRate: z.number().min(0, "Pay rate must be positive").max(999999, "Pay rate is too high"),
  payType: z.enum(["HOURLY", "SALARY"], { message: "Pay type must be HOURLY or SALARY" }),
  role: z.enum(["EMPLOYEE", "MANAGER"], { message: "Role must be EMPLOYEE or MANAGER" }).optional().default("EMPLOYEE"),
  departmentId: z.string().min(1, "Department is required"),
  positionId: z.string().min(1, "Position is required"),
  managerId: z.string().optional(),
  sin: z.string().min(9, "SIN must be 9 digits").max(11, "SIN must be 9-11 characters"),
  emergencyContactName: z.string().max(100, "Emergency contact name must be less than 100 characters").optional(),
  emergencyContactPhone: z.string().max(15, "Emergency contact phone must be less than 15 characters").optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters").optional(),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters").optional(),
  middleName: z.string().max(50, "Middle name must be less than 50 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits").optional(),
  addressLine1: z.string().min(1, "Address line 1 is required").max(100, "Address line 1 must be less than 100 characters").optional(),
  addressLine2: z.string().max(100, "Address line 2 must be less than 100 characters").optional(),
  city: z.string().min(1, "City is required").max(50, "City must be less than 50 characters").optional(),
  province: z.string().length(2, "Province must be 2 characters").optional(),
  postalCode: z.string().min(6, "Postal code must be 6 characters").max(7, "Postal code must be 6-7 characters").optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  hireDate: z.string().min(1, "Hire date is required").optional(),
  payRate: z.number().min(0, "Pay rate must be positive").max(999999, "Pay rate is too high").optional(),
  payType: z.enum(["HOURLY", "SALARY"], { message: "Pay type must be HOURLY or SALARY" }).optional(),
  departmentId: z.string().min(1, "Department is required").optional(),
  positionId: z.string().min(1, "Position is required").optional(),
  managerId: z.string().nullish(),
  sin: z.string().min(9, "SIN must be 9 digits").max(11, "SIN must be 9-11 characters").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"], { message: "Invalid status" }).optional(),
  emergencyContactName: z.string().max(100, "Emergency contact name must be less than 100 characters").nullish(),
  emergencyContactPhone: z.string().max(15, "Emergency contact phone must be less than 15 characters").nullish(),
  notes: z.string().max(500, "Notes must be less than 500 characters").nullish(),
});

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().max(100).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"]).optional(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  managerId: z.string().optional(),
  sortBy: z.enum(["firstName", "lastName", "email", "hireDate", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type exports
export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;
export type EmployeeListQuerySchema = z.infer<typeof employeeListQuerySchema>;