/**
 * Transaction Utility
 * Provides Prisma transaction support for atomic database operations
 */

import { db } from '@/lib/db'

/**
 * Execute a function within a database transaction
 * All operations are committed or rolled back together
 */
export async function executeTransaction<T>(
  operation: (tx: any) => Promise<T>,
  errorMessage: string = 'Transaction failed'
): Promise<T> {
  try {
    return await db.$transaction(async (tx) => {
      return await operation(tx)
    })
  } catch (error: any) {
    console.error(`${errorMessage}:`, error)
    throw new Error(`${errorMessage}: ${error.message}`)
  }
}

/**
 * Create multiple records in a single transaction
 */
export async function createMultiple<T>(
  modelName: string,
  data: T[]
): Promise<void> {
  return await executeTransaction(async (tx) => {
    for (const item of data) {
      await (tx as any)[modelName.toLowerCase()].create({ data: item })
    }
  })
}

/**
 * Update multiple records in a single transaction
 */
export async function updateMultiple<T>(
  modelName: string,
  updates: { where: any, data: any }[]
): Promise<void> {
  return await executeTransaction(async (tx) => {
    for (const update of updates) {
      await (tx as any)[modelName.toLowerCase()].update(update)
    }
  })
}

/**
 * Delete multiple records in a single transaction
 */
export async function deleteMultiple(
  modelName: string,
  ids: string[]
): Promise<void> {
  return await executeTransaction(async (tx) => {
    await (tx as any)[modelName.toLowerCase()].deleteMany({
      where: { id: { in: ids } }
    })
  })
}
