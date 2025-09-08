import { z } from "zod";

// Schedule Status Enum Schema
export const ScheduleStatusSchema = z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]);

// Base Schedule Validation
export const ScheduleBaseSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  breakDuration: z.number().int().min(0).max(480).optional().default(0), // Max 8 hours
  position: z.string().optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 0.25; // Minimum 15 minutes
}, {
  message: "Schedule must be at least 15 minutes long",
  path: ["endTime"],
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= 24; // Maximum 24 hours
}, {
  message: "Schedule cannot exceed 24 hours",
  path: ["endTime"],
});

// Create Schedule Request Schema
export const CreateScheduleRequestSchema = ScheduleBaseSchema;

// Update Schedule Request Schema
export const UpdateScheduleRequestSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  breakDuration: z.number().int().min(0).max(480).optional(),
  position: z.string().optional(),
  notes: z.string().max(500).optional(),
  status: ScheduleStatusSchema.optional(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  // If both startTime and endTime are provided, validate them
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return start < end;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Bulk Create Schedule Request Schema
export const BulkCreateScheduleRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  schedules: z.array(
    z.object({
      employeeId: z.string().min(1, "Employee ID is required"),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
      breakDuration: z.number().int().min(0).max(480).optional().default(0),
      position: z.string().optional(),
      notes: z.string().max(500).optional(),
    }).refine((data) => {
      // Validate time format and logic
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      // Handle next-day shifts (e.g., 23:00 to 07:00)
      const actualEndMinutes = endMinutes < startMinutes ? endMinutes + 24 * 60 : endMinutes;
      
      return actualEndMinutes - startMinutes >= 15; // Minimum 15 minutes
    }, {
      message: "Schedule must be at least 15 minutes long",
      path: ["endTime"],
    }).refine((data) => {
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      const actualEndMinutes = endMinutes < startMinutes ? endMinutes + 24 * 60 : endMinutes;
      
      return actualEndMinutes - startMinutes <= 24 * 60; // Maximum 24 hours
    }, {
      message: "Schedule cannot exceed 24 hours",
      path: ["endTime"],
    })
  ).min(1, "At least one schedule is required"),
});

// Get Schedules Query Parameters Schema
export const GetSchedulesParamsSchema = z.object({
  employeeId: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: ScheduleStatusSchema.optional(),
  includeInactive: z.boolean().optional().default(false),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

// Conflict Check Request Schema
export const ConflictCheckRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  excludeScheduleId: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Schedule Filters Schema (for frontend)
export const ScheduleFiltersSchema = z.object({
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  employeeIds: z.array(z.string()),
  statuses: z.array(ScheduleStatusSchema),
  positions: z.array(z.string()),
});

// Type exports for TypeScript
export type CreateScheduleRequestType = z.infer<typeof CreateScheduleRequestSchema>;
export type UpdateScheduleRequestType = z.infer<typeof UpdateScheduleRequestSchema>;
export type BulkCreateScheduleRequestType = z.infer<typeof BulkCreateScheduleRequestSchema>;
export type GetSchedulesParamsType = z.infer<typeof GetSchedulesParamsSchema>;
export type ConflictCheckRequestType = z.infer<typeof ConflictCheckRequestSchema>;
export type ScheduleFiltersType = z.infer<typeof ScheduleFiltersSchema>;