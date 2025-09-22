// Payslip Types
export interface Payslip {
  id: string;
  employeeId: string;
  payPeriodId: string;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  filePath?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  employee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    employeeNumber?: string;
    payRate?: number;
    payType?: string;
  };
  payPeriod?: {
    id: string;
    startDate: string;
    endDate: string;
    payDate: string;
    status: string;
  };
}

// Payslip Requests
export interface GeneratePayslipsRequest {
  payPeriodId: string;
  employeeIds?: string[]; // Optional: generate for specific employees only
  recalculate?: boolean;  // If true, regenerate existing payslips
}

export interface GetPayslipsParams {
  employeeId?: string;
  payPeriodId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface UpdatePayslipRequest {
  deductions?: number;
  notes?: string;
}

// Payslip Responses
export interface GeneratePayslipsResponse {
  payslips: Payslip[];
  summary: {
    totalEmployees: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    averageHours: number;
  };
  message: string;
}

export interface GetPayslipsResponse {
  data: Payslip[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayslipSummary {
  employeeId: string;
  employeeName: string;
  employeeNumber?: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
}