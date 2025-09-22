import { PayPeriodStatus } from "../database";

// Pay Period Management Types
export interface PayPeriod {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  payDate: string; // ISO date string
  status: PayPeriodStatus;
  createdAt: string;
  updatedAt: string;
}

// Pay Period Requests
export interface CreatePayPeriodRequest {
  year: number;
  month: number; // 1-12
  period: "A" | "B"; // A = 1-15, B = 16-end
}

export interface UpdatePayPeriodRequest {
  payDate?: string;
  status?: PayPeriodStatus;
}

export interface GetPayPeriodsParams {
  year?: number;
  month?: number;
  status?: PayPeriodStatus;
  page?: number;
  limit?: number;
}

// Pay Period Responses
export interface CreatePayPeriodResponse {
  payPeriod: PayPeriod;
  message: string;
}

export interface GetPayPeriodsResponse {
  data: PayPeriod[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayPeriodSummary {
  id: string;
  period: string; // "2024-01-A" format
  startDate: string;
  endDate: string;
  payDate: string;
  status: PayPeriodStatus;
  employeeCount: number;
  totalPayslips: number;
  totalGrossPay: number;
  totalNetPay: number;
}

export interface GetCurrentPayPeriodResponse {
  currentPeriod?: PayPeriod;
  nextPeriod?: PayPeriod;
  previousPeriod?: PayPeriod;
}
