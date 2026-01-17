/**
 * Comprehensive Error Handler
 * Provides standardized error handling with logging and user-friendly messages
 */

export class AppError extends Error {
  code: string
  statusCode: number
  isOperational: boolean

  constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, isOperational: boolean = false) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400)
    this.details = details
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, true)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401, true)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'FORBIDDEN', 403, true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409, true)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500, false)
    this.originalError = originalError
  }
}

export function logError(error: Error, context?: string, userId?: string) {
  const errorData: any = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  }

  if (context) {
    errorData.context = context
  }

  if (userId) {
    errorData.userId = userId
  }

  console.error('[ERROR]', JSON.stringify(errorData, null, 2))
}

export function formatErrorResponse(error: AppError) {
  return {
    success: false,
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
  }
}

export async function asyncHandler(fn: (req: any, res: any, next: any) => Promise<any>) {
  return async (req: any, res: any, next: any) => {
    try {
      return await fn(req, res, next)
    } catch (error) {
      logError(error)

      if (error instanceof AppError) {
        const response = formatErrorResponse(error)
        return res.status(error.statusCode).json(response)
      }

      const appError = new AppError('An unexpected error occurred')
      const response = formatErrorResponse(appError)
      return res.status(500).json(response)
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean, strength: string, suggestions: string[] } {
  const suggestions: string[] = []
  let isValid = true
  let strength = 'Weak'

  if (password.length < 8) {
    isValid = false
    suggestions.push('Password must be at least 8 characters long')
  } else if (password.length < 12) {
    strength = 'Weak'
    suggestions.push('Consider using a password of at least 12 characters')
  } else if (password.length < 16) {
    strength = 'Moderate'
  } else {
    strength = 'Strong'
  }

  if (!/[A-Z]/.test(password)) {
    strength = 'Weak'
    suggestions.push('Add uppercase letters')
  }

  if (!/[a-z]/.test(password)) {
    strength = 'Weak'
    suggestions.push('Add lowercase letters')
  }

  if (!/[0-9]/.test(password)) {
    strength = 'Weak'
    suggestions.push('Add numbers')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    strength = 'Moderate'
    suggestions.push('Add special characters')
  }

  return { isValid, strength, suggestions }
}

export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input.trim().substring(0, maxLength).replace(/[<>]/g, '')
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function safeJSONParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    logError(error as Error, 'JSON Parse Error')
    return null
  }
}
