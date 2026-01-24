type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, any>
  timestamp: Date
  userId?: string
  requestId?: string
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production'

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
    }

    if (this.isProduction) {
      // In production, send to logging service (Sentry, LogRocket, etc.)
      // For now, we'll use console but with structured format
      console[level === 'debug' ? 'log' : level](JSON.stringify({
        level: entry.level,
        message: entry.message,
        ...entry.context,
        timestamp: entry.timestamp.toISOString(),
      }))
    } else {
      // In development, use pretty console output
      const prefix = `[${entry.level.toUpperCase()}]`
      console[level === 'debug' ? 'log' : level](prefix, message, context || '')
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  // Auth-specific logging methods (without sensitive data)
  loginAttempt(email: string, success: boolean) {
    this.info('Login attempt', {
      email: success ? email : 'redacted', // Don't log email on failed attempts to prevent info leakage
      success,
    })
  }

  loginFailed(email: string, reason: string) {
    this.warn('Login failed', {
      email: 'redacted',
      reason,
    })
  }

  signupAttempt(email: string, success: boolean) {
    this.info('Signup attempt', {
      email: success ? email : 'redacted',
      success,
    })
  }

  signupFailed(email: string, reason: string) {
    this.warn('Signup failed', {
      email: 'redacted',
      reason,
    })
  }

  apiRequest(method: string, endpoint: string, statusCode?: number) {
    this.debug('API request', {
      method,
      endpoint,
      statusCode,
    })
  }

  apiError(method: string, endpoint: string, error: any) {
    this.error('API error', {
      method,
      endpoint,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const logger = new Logger()
