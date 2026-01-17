/**
 * Pagination Utility
 * Provides standardized pagination support with sorting
 */

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResult<T> {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export async function paginate<T>(
  model: any,
  options: PaginationOptions,
  where?: any
): Promise<PaginationResult<T>> {
  const page = options.page || 1
  const limit = options.limit || 20
  const skip = (page - 1) * limit

  // Build orderBy object
  const orderBy: any = {}
  if (options.sortBy) {
    const sortOrder = options.sortOrder || 'desc'
    orderBy[options.sortBy] = sortOrder
  } else {
    orderBy.createdAt = 'desc'
  }

  // Fetch data and count in parallel
  const [data, totalCount] = await Promise.all([
    (model as any).findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    (model as any).count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    data,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  }
}

export function buildPaginationParams(options: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): URLSearchParams {
  const params = new URLSearchParams()
  
  if (options.page && options.page > 1) {
    params.append('page', options.page.toString())
  }
  
  if (options.limit) {
    params.append('limit', options.limit.toString())
  }
  
  if (options.sortBy) {
    params.append('sort', options.sortBy)
  }
  
  if (options.sortOrder) {
    params.append('order', options.sortOrder)
  }
  
  return params
}
