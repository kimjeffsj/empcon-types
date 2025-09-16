import { BaseEntity, PaginatedResponse } from "../common";

// Enums
export type TimeEntryStatus = "CLOCKED_IN" | "CLOCKED_OUT" | "ADJUSTED";

// Core TimeEntry Interface
export interface TimeEntry extends BaseEntity {
  employeeId: string;
  scheduleId?: string;
  clockInTime: string; // ISO string from API
  clockOutTime?: string; // ISO string from API
  clockInLocation?: string;
  clockOutLocation?: string;
  clockInIp?: string;
  clockOutIp?: string;
  
  // Grace Period handling fields
  scheduledStartTime?: string; // ISO string from API
  scheduledEndTime?: string;   // ISO string from API
  adjustedStartTime?: string;  // ISO string from API
  adjustedEndTime?: string;    // ISO string from API
  gracePeriodApplied: boolean;
  
  totalHours?: number;         // Decimal as number from API
  overtimeHours?: number;      // Decimal as number from API
  status: TimeEntryStatus;
  
  // Relations (optional for API responses)
  employee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    employeeNumber?: string;
  };
  schedule?: {
    id: string;
    startTime: string;
    endTime: string;
    position?: string;
  };
}

// Clock Operations - API Request Types
export interface ClockInRequest {
  employeeId: string;
  scheduleId: string; // Required - must have valid schedule to clock in
  clockInLocation?: string;
}

export interface ClockOutRequest {
  timeEntryId: string;
  clockOutLocation?: string;
}

// Clock Operations - API Response Types
export interface ClockInResponse {
  timeEntry: TimeEntry;
  message: string;
  gracePeriodInfo?: {
    originalClockInTime: string;
    adjustedClockInTime: string;
    gracePeriodApplied: boolean;
  };
}

export interface ClockOutResponse {
  timeEntry: TimeEntry;
  message: string;
  payrollInfo: {
    totalMinutesWorked: number;
    roundedMinutes: number;
    finalHours: number;
    overtimeHours?: number;
  };
  gracePeriodInfo?: {
    originalClockOutTime: string;
    adjustedClockOutTime: string;
    gracePeriodApplied: boolean;
  };
}

// Clock Status
export interface ClockStatusRequest {
  employeeId: string;
  date?: string; // Optional: specific date, defaults to today
}

export interface ClockStatusResponse {
  employeeId: string;
  isClocked: boolean;
  currentTimeEntry?: TimeEntry;
  todaySchedules: Array<{
    id: string;
    startTime: string;
    endTime: string;
    position?: string;
    status: string;
    canClockIn: boolean; // Based on 5-minute rule
    timeEntryId?: string; // If already clocked in for this schedule
  }>;
  summary: {
    date: string;
    totalSchedules: number;
    completedShifts: number;
    hoursWorkedToday: number;
  };
}

// Time Entries Query
export interface GetTimeEntriesParams {
  employeeId?: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  status?: TimeEntryStatus;
  scheduleId?: string;
  page?: number;
  limit?: number;
}

export interface GetTimeEntriesResponse extends PaginatedResponse<TimeEntry> {}

// Manual Time Adjustment (Admin/Manager)
export interface TimeAdjustmentRequest {
  timeEntryId: string;
  clockInTime?: string;    // ISO string
  clockOutTime?: string;   // ISO string
  reason: string;          // Reason for manual adjustment
  adjustedBy: string;      // Manager/Admin ID
}

export interface TimeAdjustmentResponse {
  timeEntry: TimeEntry;
  adjustmentRecord: {
    id: string;
    originalClockInTime?: string;
    originalClockOutTime?: string;
    newClockInTime?: string;
    newClockOutTime?: string;
    reason: string;
    adjustedBy: string;
    adjustedAt: string;
  };
  message: string;
}


// Payroll Rounding and Grace Period Utilities
export interface PayrollRoundingResult {
  originalMinutes: number;
  roundedMinutes: number;
  originalTime: string;
  roundedTime: string;
}

export interface TimeClockGracePeriodResult {
  originalTime: string;
  adjustedTime: string;
  gracePeriodApplied: boolean;
  withinGracePeriod: boolean;
}

// Validation Error Types
export interface ClockValidationError {
  code: string;
  message: string;
  details?: {
    scheduleId?: string;
    allowedClockInTime?: string;
    conflictingTimeEntry?: string;
  };
}

// API Response Wrapper Types
export interface TimeClockApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ClockValidationError[];
  message?: string;
}

// Time Clock Business Rules Constants (for frontend reference)
export interface TimeClockRules {
  gracePeriodMinutes: number;          // 5 minutes
  clockInWindowMinutes: number;        // 5 minutes before schedule
  payrollRoundingMinutes: number;      // 15 minutes
  maxShiftHours: number;               // 24 hours
  overtimeThresholdHours: number;      // 8 hours (configurable)
}

export const DEFAULT_TIMECLOCK_RULES: TimeClockRules = {
  gracePeriodMinutes: 5,
  clockInWindowMinutes: 5,
  payrollRoundingMinutes: 15,
  maxShiftHours: 24,
  overtimeThresholdHours: 8,
};

// Error Messages (for consistent error handling)
export const TIMECLOCK_ERROR_MESSAGES = {
  NO_SCHEDULE: 'No schedule found for today. Cannot clock in.',
  TOO_EARLY: 'Clock-in not allowed yet. You can clock in 5 minutes before your scheduled time.',
  ALREADY_CLOCKED_IN: 'Already clocked in for this shift.',
  NOT_CLOCKED_IN: 'You must clock in first before clocking out.',
  EARLY_CLOCKOUT: 'You are clocking out early. Have you contacted your manager?',
  INVALID_EMPLOYEE: 'Employee not found or inactive.',
  SYSTEM_ERROR: 'System error. Please try again or contact IT support.',
  SCHEDULE_NOT_FOUND: 'Schedule not found.',
  TIME_ENTRY_NOT_FOUND: 'Time entry not found.',
  INVALID_TIME_ADJUSTMENT: 'Invalid time adjustment request.',
  UNAUTHORIZED_ADJUSTMENT: 'You do not have permission to adjust time entries.',
} as const;