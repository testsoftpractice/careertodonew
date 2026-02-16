import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma client (singleton pattern for serverless)
if (!globalForPrisma.prisma) {
  console.log('[DB] Initializing Prisma Client...')
  console.log('[DB] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')

  // For SQLite, use simple configuration
  const connectionString = process.env.DATABASE_URL || ''

  let prismaConfig: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  }

  // Only add datasource config for PostgreSQL/Supabase
  if (connectionString.includes('postgresql') || connectionString.includes('supabase')) {
    prismaConfig.datasources = {
      db: {
        url: connectionString
      }
    }
  }
  // For SQLite, let Prisma handle the DATABASE_URL automatically

  console.log('[DB] Using config:', JSON.stringify(prismaConfig, null, 2))
  globalForPrisma.prisma = new PrismaClient(prismaConfig)
}

export const db = globalForPrisma.prisma
