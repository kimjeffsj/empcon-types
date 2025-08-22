import { z } from 'zod';

// Department validation schemas
export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  managerId: z.string().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name must be less than 100 characters").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  managerId: z.string().optional(),
});

// Type exports
export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;