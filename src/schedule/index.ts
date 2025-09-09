import { BaseEntity, PaginatedResponse } from "../common";

// Enums
export type ScheduleStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

// Core Schedule Interface
export interface Schedule extends BaseEntity {
  employeeId: string;
  startTime: string; // ISO string from API
  endTime: string;   // ISO string from API
  breakDuration: number; // in minutes
  position?: string;
  status: ScheduleStatus;
  notes?: string;
  isActive: boolean;
  createdBy: string;
  
  // Relations (optional for API responses)
  employee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    employeeNumber?: string;
  };
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

// API Request/Response Types
export interface CreateScheduleRequest {
  employeeId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  breakDuration?: number;
  position?: string;
  notes?: string;
}

export interface UpdateScheduleRequest {
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  position?: string;
  notes?: string;
  status?: ScheduleStatus;
  isActive?: boolean;
}

export interface BulkCreateScheduleRequest {
  date: string; // ISO date string
  schedules: Array<{
    employeeId: string;
    startTime: string; // Time portion only (e.g., "09:00")
    endTime: string;   // Time portion only (e.g., "17:00")
    breakDuration?: number;
    position?: string;
    notes?: string;
  }>;
}

export interface BulkCreateScheduleResponse {
  created: Schedule[];
  errors: Array<{
    employeeId: string;
    error: string;
  }>;
}

// Query Parameters
export interface GetSchedulesParams {
  employeeId?: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  status?: ScheduleStatus;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

// Conflict Detection
export interface ConflictCheckRequest {
  employeeId: string;
  startTime: string;
  endTime: string;
  excludeScheduleId?: string; // For update operations
}

export interface ConflictCheckResponse {
  hasConflict: boolean;
  conflictingSchedules: Array<{
    id: string;
    startTime: string;
    endTime: string;
    overlapMinutes: number;
  }>;
}

// Today's Roster (Dashboard)
export interface TodayRosterResponse {
  date: string;
  totalScheduled: number;
  schedules: Array<{
    id: string;
    employee: {
      id: string;
      firstName?: string;
      lastName?: string;
      employeeNumber?: string;
    };
    startTime: string; // ISO string from API
    endTime: string;   // ISO string from API
    position?: string;
    status: ScheduleStatus;
    isCurrentlyWorking?: boolean; // Based on current time
  }>;
}

// API Response Types
export interface GetSchedulesResponse extends PaginatedResponse<Schedule> {}

export interface ScheduleApiResponse<T = Schedule> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Grace Period Integration Types (for TimeEntry)
// Note: Uses Date objects for internal calculations, converted from API strings
export interface ScheduleTimeInfo {
  scheduleId: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  gracePeriodMinutes: number;
}

export interface GracePeriodResult {
  originalTime: Date;
  adjustedTime: Date;
  gracePeriodApplied: boolean;
  withinGracePeriod: boolean;
}

// Calendar View Types
// Note: Uses Date objects for calendar library compatibility, converted from Schedule strings
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: Schedule;
  backgroundColor?: string;
  borderColor?: string;
}

// Frontend filtering types - uses Date objects for easier manipulation
export interface ScheduleFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  employeeIds: string[];
  statuses: ScheduleStatus[];
  positions: string[];
}