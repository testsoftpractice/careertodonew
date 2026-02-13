import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}
export interface ApiError {
  statusCode: number
  message: string
  details?: any
}

export function successResponse<T>(data: T, message?: string, meta?: ApiResponse<T>['meta'], statusCode: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    ...meta ? { meta } : {},
  }, { status: statusCode })
}

export function errorResponse(
  error: string,
  statusCode: number = 500,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details ? { details } : {}),
    },
    { status: statusCode }
  )
}

export function badRequest(error: string, details?: any): NextResponse<ApiResponse> {
  return errorResponse(error, 400, details)
}

export function unauthorized(error: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(error, 401)
}

export function forbidden(error: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(error, 403)
}

export function notFound(error: string = 'Not found'): NextResponse<ApiResponse> {
  return errorResponse(error, 404)
}

export function conflict(error: string, details?: any): NextResponse<ApiResponse> {
  return errorResponse(error, 409, details)
}

export function tooManyRequests(error: string = 'Too many requests', retryAfter?: number): NextResponse<ApiResponse> {
  const headers = retryAfter ? { 'Retry-After': String(retryAfter) } : {}
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 429, headers }
  )
}

export function validationError(errors: Array<{ field: string; message: string }>): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: errors,
    },
    { status: 400 }
  )
}

/**
 * Authenticated fetch wrapper - adds Authorization header with bearer token
 * This should be used for all authenticated API requests
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = localStorage.getItem('token')

  const headers: HeadersInit = {
    ...options.headers,
    'Content-Type': 'application/json',
  }

  // Add Authorization header if token exists
  if (authHeader) {
    headers['Authorization'] = 'Bearer ' + authHeader
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}
