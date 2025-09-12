import { z } from 'zod';

// TimeEntry Status Enum Schema
export const TimeEntryStatusSchema = z.enum(["CLOCKED_IN", "CLOCKED_OUT", "ADJUSTED"]);

// Clock-in validation schema
export const ClockInRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  scheduleId: z.string().min(1, "Schedule ID is required - you must have a valid schedule to clock in"),
  clockInLocation: z.string().max(255, "Clock-in location must be less than 255 characters").optional(),
});

// Clock-out validation schema
export const ClockOutRequestSchema = z.object({
  timeEntryId: z.string().min(1, "Time entry ID is required"),
  clockOutLocation: z.string().max(255, "Clock-out location must be less than 255 characters").optional(),
});

// Clock status validation schema
export const ClockStatusRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
});

// Get time entries validation schema
export const GetTimeEntriesParamsSchema = z.object({
  employeeId: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format").optional(),
  status: TimeEntryStatusSchema.optional(),
  scheduleId: z.string().optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1").optional().default(1),
  limit: z.coerce.number().int().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").optional().default(20),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

// Time adjustment validation schema (Admin/Manager only)
export const TimeAdjustmentRequestSchema = z.object({
  timeEntryId: z.string().min(1, "Time entry ID is required"),
  clockInTime: z.string().datetime("Clock-in time must be a valid ISO date string").optional(),
  clockOutTime: z.string().datetime("Clock-out time must be a valid ISO date string").optional(),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason must be less than 500 characters"),
  adjustedBy: z.string().min(1, "Adjusted by (user ID) is required"),
}).refine((data) => {
  // At least one time field must be provided
  return data.clockInTime || data.clockOutTime;
}, {
  message: "At least one time field (clockInTime or clockOutTime) must be provided",
  path: ["clockInTime"],
}).refine((data) => {
  // If both times are provided, clockOutTime must be after clockInTime
  if (data.clockInTime && data.clockOutTime) {
    const clockIn = new Date(data.clockInTime);
    const clockOut = new Date(data.clockOutTime);
    return clockOut > clockIn;
  }
  return true;
}, {
  message: "Clock-out time must be after clock-in time",
  path: ["clockOutTime"],
}).refine((data) => {
  // Check for reasonable shift length (max 24 hours)
  if (data.clockInTime && data.clockOutTime) {
    const clockIn = new Date(data.clockInTime);
    const clockOut = new Date(data.clockOutTime);
    const shiftHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
    return shiftHours <= 24;
  }
  return true;
}, {
  message: "Shift cannot exceed 24 hours",
  path: ["clockOutTime"],
});

// Today's clock status validation schema (Admin dashboard)
export const TodayClockStatusRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
});

// Route parameter validation schemas
export const TimeEntryIdParamSchema = z.object({
  id: z.string().min(1, "Time entry ID is required"),
});

export const EmployeeIdParamSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
});

// Type exports
export type ClockInRequestType = z.infer<typeof ClockInRequestSchema>;
export type ClockOutRequestType = z.infer<typeof ClockOutRequestSchema>;
export type ClockStatusRequestType = z.infer<typeof ClockStatusRequestSchema>;
export type GetTimeEntriesParamsType = z.infer<typeof GetTimeEntriesParamsSchema>;
export type TimeAdjustmentRequestType = z.infer<typeof TimeAdjustmentRequestSchema>;
export type TodayClockStatusRequestType = z.infer<typeof TodayClockStatusRequestSchema>;
export type TimeEntryIdParamType = z.infer<typeof TimeEntryIdParamSchema>;
export type EmployeeIdParamType = z.infer<typeof EmployeeIdParamSchema>;

// Common validation helpers
export const timeClockValidationHelpers = {
  isValidISODate: (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString;
  },
  
  isWithinReasonableTimeRange: (startTime: string, endTime: string, maxHours: number = 24): boolean => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 && hours <= maxHours;
  },
  
  isValidTimeFormat: (timeString: string): boolean => {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
  }
};