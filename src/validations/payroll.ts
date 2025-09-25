import { z } from "zod";

// Pay Period Schemas
export const CreatePayPeriodSchema = z.object({
  year: z.number().int().min(2020).max(2050),
  month: z.number().int().min(1).max(12),
  period: z.enum(["A", "B"]),
});

export const UpdatePayPeriodSchema = z.object({
  payDate: z.string().optional(),
  status: z.enum(["OPEN", "PROCESSING", "COMPLETED", "PAID"]).optional(),
});

export const GetPayPeriodsParamsSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  status: z.enum(["OPEN", "PROCESSING", "COMPLETED", "PAID"]).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

// Payslip Schemas
export const GeneratePayslipsSchema = z.object({
  payPeriodId: z.string().cuid(),
  employeeIds: z.array(z.string().cuid()).optional(),
  recalculate: z.boolean().default(false).optional(),
});

export const GetPayslipsParamsSchema = z.object({
  employeeId: z.string().cuid().optional(),
  payPeriodId: z.string().cuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export const UpdatePayslipSchema = z.object({
  deductions: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

// Parameter Schemas
export const PayPeriodIdParamSchema = z.object({
  id: z.string().cuid(),
});

export const PayslipIdParamSchema = z.object({
  id: z.string().cuid(),
});

export const EmployeePayrollParamsSchema = z.object({
  employeeId: z.string().cuid(),
  payPeriodId: z.string().cuid().optional(),
});

// Query Schemas
export const PayrollSummaryQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050).optional(),
  employeeId: z.string().cuid().optional(),
});

// Excel Report Schemas
export const GenerateExcelReportSchema = z.object({
  payPeriodId: z.string().cuid(),
  format: z.enum(["excel", "pdf"]).default("excel").optional(),
});

// Email Integration Schemas
export const SendToAccountantSchema = z.object({
  payPeriodId: z.string().cuid(),
  accountantEmail: z.string().email().optional(),
});
