import Joi from 'joi';

// Clock-in validation schema
export const clockInSchema = Joi.object({
  employeeId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required'
    }),
  
  scheduleId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Schedule ID is required',
      'any.required': 'Schedule ID is required - you must have a valid schedule to clock in'
    }),
    
  clockInLocation: Joi.string()
    .optional()
    .max(255)
    .messages({
      'string.max': 'Clock-in location must be less than 255 characters'
    })
});

// Clock-out validation schema
export const clockOutSchema = Joi.object({
  timeEntryId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Time entry ID is required',
      'any.required': 'Time entry ID is required'
    }),
    
  clockOutLocation: Joi.string()
    .optional()
    .max(255)
    .messages({
      'string.max': 'Clock-out location must be less than 255 characters'
    })
});

// Clock status validation schema
export const clockStatusSchema = Joi.object({
  employeeId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required'
    }),
    
  date: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format'
    })
});

// Get time entries validation schema
export const getTimeEntriesSchema = Joi.object({
  employeeId: Joi.string()
    .optional(),
    
  startDate: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'Start date must be in YYYY-MM-DD format'
    }),
    
  endDate: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'End date must be in YYYY-MM-DD format'
    }),
    
  status: Joi.string()
    .optional()
    .valid('CLOCKED_IN', 'CLOCKED_OUT', 'ADJUSTED')
    .messages({
      'any.only': 'Status must be one of: CLOCKED_IN, CLOCKED_OUT, ADJUSTED'
    }),
    
  scheduleId: Joi.string()
    .optional(),
    
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1',
      'number.integer': 'Page must be an integer'
    }),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
      'number.integer': 'Limit must be an integer'
    })
});

// Time adjustment validation schema (Admin/Manager only)
export const timeAdjustmentSchema = Joi.object({
  timeEntryId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Time entry ID is required',
      'any.required': 'Time entry ID is required'
    }),
    
  clockInTime: Joi.string()
    .optional()
    .isoDate()
    .messages({
      'string.isoDate': 'Clock-in time must be a valid ISO date string'
    }),
    
  clockOutTime: Joi.string()
    .optional()
    .isoDate()
    .messages({
      'string.isoDate': 'Clock-out time must be a valid ISO date string'
    }),
    
  reason: Joi.string()
    .required()
    .min(10)
    .max(500)
    .messages({
      'string.empty': 'Reason is required',
      'any.required': 'Reason is required for time adjustments',
      'string.min': 'Reason must be at least 10 characters',
      'string.max': 'Reason must be less than 500 characters'
    }),
    
  adjustedBy: Joi.string()
    .required()
    .messages({
      'string.empty': 'Adjusted by (user ID) is required',
      'any.required': 'Adjusted by (user ID) is required'
    })
}).custom((value, helpers) => {
  // At least one time field must be provided
  if (!value.clockInTime && !value.clockOutTime) {
    return helpers.error('custom.missingTimeFields');
  }
  
  // If both times are provided, clockOutTime must be after clockInTime
  if (value.clockInTime && value.clockOutTime) {
    const clockIn = new Date(value.clockInTime);
    const clockOut = new Date(value.clockOutTime);
    
    if (clockOut <= clockIn) {
      return helpers.error('custom.invalidTimeRange');
    }
    
    // Check for reasonable shift length (max 24 hours)
    const shiftHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
    if (shiftHours > 24) {
      return helpers.error('custom.shiftTooLong');
    }
  }
  
  return value;
}).messages({
  'custom.missingTimeFields': 'At least one time field (clockInTime or clockOutTime) must be provided',
  'custom.invalidTimeRange': 'Clock-out time must be after clock-in time',
  'custom.shiftTooLong': 'Shift cannot exceed 24 hours'
});

// Today's clock status validation schema (Admin dashboard)
export const todayClockStatusSchema = Joi.object({
  date: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format'
    })
});

// Route parameter validation schemas
export const timeEntryIdParamSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'Time entry ID is required',
      'any.required': 'Time entry ID is required'
    })
});

export const employeeIdParamSchema = Joi.object({
  employeeId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required'
    })
});

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