import { z } from 'zod';

// Position validation schemas
export const createPositionSchema = z.object({
  title: z.string().min(1, "Position title is required").max(100, "Position title must be less than 100 characters"),
  departmentId: z.string().min(1, "Department is required"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export const updatePositionSchema = z.object({
  title: z.string().min(1, "Position title is required").max(100, "Position title must be less than 100 characters").optional(),
  departmentId: z.string().min(1, "Department is required").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

// Type exports
export type CreatePositionSchema = z.infer<typeof createPositionSchema>;
export type UpdatePositionSchema = z.infer<typeof updatePositionSchema>;