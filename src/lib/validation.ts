import { z } from 'zod'

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Basic email validation
export const emailSchema = z.string().email('Invalid email format').max(254, 'Email too long')

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/, 'Password must contain at least one special character')

// Name validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Phone number validation (basic)
export const phoneSchema = z.string()
  .regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .max(20, 'Phone number too long')

// URL validation
export const urlSchema = z.string().url('Invalid URL format').max(2048, 'URL too long')

// Text area validation (for descriptions, bios, etc.)
export const textAreaSchema = z.string()
  .max(2000, 'Text too long (max 2000 characters)')
  .transform(sanitizeHtml)

// Project/task title validation
export const titleSchema = z.string()
  .min(1, 'Title is required')
  .max(200, 'Title too long')
  .transform(sanitizeHtml)

// University code validation
export const universityCodeSchema = z.string()
  .min(2, 'University code must be at least 2 characters')
  .max(10, 'University code too long')
  .regex(/^[A-Z0-9]+$/, 'University code can only contain uppercase letters and numbers')

// Role validation
export const roleSchema = z.enum(['STUDENT', 'UNIVERSITY_ADMIN', 'EMPLOYER', 'INVESTOR', 'PLATFORM_ADMIN'])

// Common validation schemas
export const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  mobileNumber: phoneSchema.optional(),
  role: roleSchema,
  universityId: z.string().uuid('Invalid university ID').optional(),
  major: z.string().max(100, 'Major too long').optional(),
  graduationYear: z.number().min(1950).max(2100).optional(),
  bio: textAreaSchema.optional(),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const universitySchema = z.object({
  name: z.string().min(1, 'University name is required').max(200, 'Name too long'),
  code: universityCodeSchema,
  description: textAreaSchema.optional(),
  location: z.string().max(200, 'Location too long').optional(),
  website: urlSchema.optional().or(z.literal(''))
})

export const projectSchema = z.object({
  name: titleSchema,
  description: textAreaSchema.optional(),
  category: z.string().max(50, 'Category too long').optional(),
  budget: z.number().min(0, 'Budget must be positive').optional()
})

export const taskSchema = z.object({
  title: titleSchema,
  description: textAreaSchema.optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional()
})

// Task validation schemas
export const createTaskSchema = taskSchema.extend({
  // Additional fields for task creation
  assigneeIds: z.array(z.string().uuid()).optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1, 'Subtask title is required'),
    completed: z.boolean().default(false)
  })).optional()
})

export const updateTaskSchema = taskSchema.partial().extend({
  // Additional fields for task updates
  assigneeIds: z.array(z.string().uuid()).optional(),
  subtasks: z.array(z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Subtask title is required'),
    completed: z.boolean(),
    sortOrder: z.number().default(0)
  })).optional()
})
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join('; ')
      return { success: false, error: errorMessages }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// SQL injection prevention for Prisma queries
export function sanitizeOrderBy(orderBy: string | undefined): string {
  if (!orderBy) return 'createdAt'
  
  // Only allow specific field names for ordering
  const allowedFields = [
    'createdAt', 'updatedAt', 'name', 'email', 'role', 'status', 'priority',
    'dueDate', 'rankingScore', 'rankingPosition', 'totalStudents', 'title'
  ]
  
  if (allowedFields.includes(orderBy)) {
    return orderBy
  }
  
  return 'createdAt' // Default safe fallback
}

export function sanitizeSortOrder(sortOrder: string | undefined): 'asc' | 'desc' {
  return sortOrder === 'desc' ? 'desc' : 'asc'
}