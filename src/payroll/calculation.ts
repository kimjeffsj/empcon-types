// Payroll Calculation Types
export interface PayrollCalculationInput {
  employeeId: string;
  payPeriodId: string;
  payRate: number;
  payType: 'HOURLY' | 'SALARY';
}

export interface PayrollCalculationResult {
  employeeId: string;
  payPeriodId: string;

  // Hours breakdown
  regularHours: number;
  overtimeHours: number;
  totalHours: number;

  // Pay calculation
  regularPay: number;
  overtimePay: number;
  grossPay: number;

  // Deductions (basic for MVP)
  deductions: number;
  netPay: number;

  // Time entries summary
  timeEntriesCount: number;
  timeEntriesDetails: TimeEntryForPayroll[];
}

export interface TimeEntryForPayroll {
  id: string;
  clockInTime: string;
  clockOutTime?: string;
  totalHours?: number;
  overtimeHours?: number;
  scheduleDate: string;
}

export interface EmployeePayrollSummary {
  employeeId: string;
  employeeName: string;
  employeeNumber?: string;
  payRate: number;
  payType: 'HOURLY' | 'SALARY';

  // Current period calculation
  currentPeriod: PayrollCalculationResult;

  // Historical data (optional)
  previousPeriods?: PayrollCalculationResult[];

  // Year-to-date summary
  ytdSummary?: {
    totalGrossPay: number;
    totalNetPay: number;
    totalHours: number;
    totalDeductions: number;
  };
}

export interface PayrollBatchCalculation {
  payPeriodId: string;
  payPeriod: {
    startDate: string;
    endDate: string;
    period: string; // "2024-01-A"
  };

  employees: PayrollCalculationResult[];

  summary: {
    totalEmployees: number;
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    averageHoursPerEmployee: number;
    averagePayPerEmployee: number;
  };

  calculatedAt: string;
}

// Overtime calculation rules
export interface OvertimeRules {
  dailyOvertimeThreshold: number; // hours per day (default: 8)
  weeklyOvertimeThreshold: number; // hours per week (default: 40)
  overtimeMultiplier: number; // default: 1.5x
}

// Basic deduction types for MVP
export interface BasicDeductions {
  cpp?: number;    // Canada Pension Plan
  ei?: number;     // Employment Insurance
  tax?: number;    // Income Tax
  other?: number;  // Other deductions
}

export const DEFAULT_OVERTIME_RULES: OvertimeRules = {
  dailyOvertimeThreshold: 8,
  weeklyOvertimeThreshold: 40,
  overtimeMultiplier: 1.5
};

export const DEFAULT_DEDUCTION_RATES = {
  cpp: 0.0595,     // 5.95% CPP rate (2024)
  ei: 0.0163,      // 1.63% EI rate (2024)
  tax: 0.15        // Basic 15% tax rate (simplified)
};