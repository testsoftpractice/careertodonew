/**
 * Cache Utility
 * Provides in-memory caching support (can be upgraded to Redis)
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
  ttl: number // Time to live in milliseconds
}

export class CacheStore {
  private store: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 300000 // 5 minutes default

  constructor(defaultTTL?: number) {
    if (defaultTTL) {
      this.defaultTTL = defaultTTL
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * Set value in cache with optional TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + (ttl || this.defaultTTL),
      ttl: ttl || this.defaultTTL,
    }

    this.store.set(key, entry)
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.store.clear()
  }

  /**
   * Clean up expired entries
   */
  async cleanup(): Promise<void> {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.store.delete(key)
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size
  }

  /**
   * Get cache keys
   */
  keys(): string[] {
    return Array.from(this.store.keys())
  }
}

// Global cache instance
const globalCache = new CacheStore(300000) // 5 minutes default

/**
 * Cache wrapper functions
 */
export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  // Try to get from cache first
  const cached = await globalCache.get<T>(key)
  
  if (cached !== null) {
    return cached
  }

  // If not in cache, fetch and store
  const data = await fetcher()
  await globalCache.set(key, data, ttl)

  return data
}

/**
 * Set value in cache
 */
export async function setCached<T>(key: string, value: T, ttl?: number): Promise<void> {
  await globalCache.set(key, value, ttl)
}

/**
 * Get value from cache
 */
export async function getCachedValue<T>(key: string): Promise<T | null> {
  return await globalCache.get<T>(key)
}

/**
 * Delete value from cache
 */
export async function deleteCached(key: string): Promise<void> {
  await globalCache.delete(key)
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  await globalCache.clear()
}

/**
 * Invalidate cache by pattern (useful for clearing related entries)
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const keys = globalCache.keys()
  
  for (const key of keys) {
    if (key.includes(pattern)) {
      await globalCache.delete(key)
    }
  }
}

/**
 * Create cache key for dashboard stats
 */
export function createDashboardStatsKey(userId: string, universityId?: string): string {
  if (universityId) {
    return `dashboard:university:${universityId}`
  }
  return `dashboard:user:${userId}`
}

/**
 * Create cache key for user data
 */
export function createUserDataKey(userId: string): string {
  return `user:data:${userId}`
}

/**
 * Create cache key for projects list
 */
export function createProjectsListKey(universityId?: string, userId?: string): string {
  if (universityId) {
    return `projects:university:${universityId}`
  }
  return `projects:user:${userId}`
}

/**
 * Create cache key for leaderboard
 */
export function createLeaderboardKey(category?: string, university?: string): string {
  const parts = ['leaderboard']
  if (category) {
    parts.push(`category:${category}`)
  }
  if (university) {
    parts.push(`university:${universityId}`)
  }
  return parts.join(':')
}
