import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma client (singleton pattern for serverless)
// Optimized for PostgreSQL/Supabase with connection pooling
if (!globalForPrisma.prisma) {
  console.log('[DB] Initializing Prisma Client...')
  console.log('[DB] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
  console.log('[DB] DIRECT_URL:', process.env.DIRECT_URL ? 'SET' : 'NOT SET')
  console.log('[DB] Using datasource URL:', process.env.DIRECT_URL || process.env.DATABASE_URL)

  const prismaConfig: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL
      }
    }
  }

  globalForPrisma.prisma = new PrismaClient(prismaConfig)
}

export const db = globalForPrisma.prisma
