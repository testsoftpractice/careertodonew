// ============================================================================
// TRANSACTION HELPERS
// ============================================================================
// Reusable transaction execution functions for database operations

/**
 * Execute a database transaction with automatic commit or rollback
 * @param options - Transaction options (prisma transaction type, etc.)
 * @returns Promise with transaction result
 */
export async function executeTransaction(options: {
  tx: any,
  data: any,
  callback?: (error?: Error) => void
}) {
  try {
    const result = await options.tx.$query.task.create({
      data: options.data,
    })
    await options.tx.$commit()
    return result
  } catch (error: any) {
    if (options.callback) {
      options.callback(error)
    }
    const dbError = new DatabaseError('Transaction failed')
    if (error instanceof AppError) {
      dbError.statusCode = error.statusCode
    }
    throw dbError
  }
}
