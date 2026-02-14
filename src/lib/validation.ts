import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const emailSchema = z.string().email('Invalid email format')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  role: z.enum(['STUDENT', 'MENTOR', 'EMPLOYER', 'INVESTOR', 'UNIVERSITY_ADMIN', 'PLATFORM_ADMIN'], {
    message: 'Invalid role specified'
  }).default('STUDENT'),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED', 'BACKLOG']).default('TODO'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  projectId: z.string().cuid('Invalid project ID').optional(),
  assigneeIds: z.array(z.string().cuid()).optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1, 'Subtask title is required'),
    completed: z.boolean().optional(),
  })).optional(),
  dueDate: z.string().optional().refine((val) => {
    if (!val) return true
    // Try to parse the date - allow various formats
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, { message: 'Invalid due date format' }),
  estimatedHours: z.union([z.number().min(0).max(1000), z.string().transform(val => parseFloat(val))]).optional(),
}).strip()  // Strip unknown fields like 'assignedBy'

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED', 'BACKLOG']).optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  projectId: z.string().cuid('Invalid project ID').optional(),
  assigneeIds: z.array(z.string().cuid()).optional(),
  subtasks: z.array(z.object({
    id: z.string().cuid().optional(),
    title: z.string().min(1, 'Subtask title is required'),
    completed: z.boolean().optional(),
  })).optional(),
  dueDate: z.string().optional().refine((val) => {
    if (!val) return true
    // Try to parse the date - allow various formats
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, { message: 'Invalid due date format' }),
  estimatedHours: z.number().min(0).max(1000).optional(),
  actualHours: z.number().min(0).max(1000).optional(),
})

// Helper function to validate and return error response if invalid
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)

  if (!result.success) {
    // Check if error object exists
    const errorObj = result.error
    if (!errorObj) {
      return {
        valid: false,
        errors: [{ field: 'unknown', message: 'Validation failed' }],
      }
    }

    // ZodError has 'issues' property, not 'errors'
    const errors = errorObj.issues.map((err: any) => ({
      field: Array.isArray(err.path) ? err.path.map(p => String(p)).join('.') : 'unknown',
      message: err.message || 'Invalid value',
    }))

    return {
      valid: false,
      errors,
    }
  }

  return {
    valid: true,
    data: result.data,
  }
}
