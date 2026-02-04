/**
 * Supabase Client Wrapper
 * Provides easy access to Supabase services
 * Supports both Supabase Auth and Database
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  console.warn('Supabase URL not configured. Using local SQLite/Prisma instead.')
  throw new Error('Supabase URL is not configured. Please set SUPABASE_URL in your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
})

// ============================================
// Database Helpers
// ============================================

/**
 * Generic query helper with error handling
 */
export async function supabaseQuery<T>(
  tableName: string,
  query: any,
  options: { count?: 'exact' | 'estimated' } = {}
) {
  try {
    let { data, error } = await supabase
      .from(tableName)
      .select('*')
      .match(query)

    if (error) {
      console.error(`Supabase query error [${tableName}]:`, error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    return data as T[]
  } catch (error) {
    console.error(`Supabase query exception [${tableName}]:`, error)
    throw error
  }
}

/**
 * Insert a record into a table
 */
export async function supabaseInsert<T>(
  tableName: string,
  record: Partial<T>
) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single()

    if (error) {
      console.error(`Supabase insert error [${tableName}]:`, error)
      throw new Error(`Insert failed: ${error.message}`)
    }

    return data as T
  } catch (error) {
    console.error(`Supabase insert exception [${tableName}]:`, error)
    throw error
  }
}

/**
 * Update a record in a table
 */
export async function supabaseUpdate<T>(
  tableName: string,
  id: string,
  updates: Partial<T>
) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Supabase update error [${tableName}]:`, error)
      throw new Error(`Update failed: ${error.message}`)
    }

    return data as T
  } catch (error) {
    console.error(`Supabase update exception [${tableName}]:`, error)
    throw error
  }
}

/**
 * Delete a record from a table
 */
export async function supabaseDelete(
  tableName: string,
  id: string
) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Supabase delete error [${tableName}]:`, error)
      throw new Error(`Delete failed: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error(`Supabase delete exception [${tableName}]:`, error)
    throw error
  }
}

/**
 * Count records in a table
 */
export async function supabaseCount(
  tableName: string,
  query: any = {}
) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .match(query)

    if (error) {
      console.error(`Supabase count error [${tableName}]:`, error)
      throw new Error(`Count failed: ${error.message}`)
    }

    return count || 0
  } catch (error) {
    console.error(`Supabase count exception [${tableName}]:`, error)
    throw error
  }
}

// ============================================
// Auth Helpers
// ============================================

/**
 * Sign up a new user
 */
export async function supabaseSignUp(email: string, password: string, metadata?: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: metadata?.name || email.split('@')[0],
        }
      }
    })

    if (error) {
      console.error('Supabase sign up error:', error)
      throw new Error(`Sign up failed: ${error.message}`)
    }

    return {
      data,
      user: data.user,
      session: data.session,
    }
  }
  catch (error) {
    console.error('Supabase sign up exception:', error)
    throw error
  }
}

/**
 * Sign in an existing user
 */
export async function supabaseSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase sign in error:', error)
      throw new Error(`Sign in failed: ${error.message}`)
    }

    return {
      data,
      user: data.user,
      session: data.session,
    }
  }
  catch (error) {
    console.error('Supabase sign in exception:', error)
    throw error
  }
}

/**
 * Sign out current user
 */
export async function supabaseSignOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase sign out error:', error)
      throw new Error(`Sign out failed: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Supabase sign out exception:', error)
    throw error
  }
}

/**
 * Get current user session
 */
export async function supabaseGetSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Supabase get session error:', error)
      throw new Error(`Get session failed: ${error.message}`)
    }

    return { session, user: session?.user }
  } catch (error) {
    console.error('Supabase get session exception:', error)
    throw error
  }
}

/**
 * Get current user
 */
export async function supabaseGetUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return null
    }

    return user
  } catch (error) {
    console.error('Supabase get user exception:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function supabaseUpdateUser(updates: any) {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser(updates)

    if (error) {
      console.error('Supabase update user error:', error)
      throw new Error(`Update user failed: ${error.message}`)
    }

    return user
  } catch (error) {
    console.error('Supabase update user exception:', error)
    throw error
  }
}

/**
 * Check if user is authenticated
 */
export function supabaseIsAuthenticated() {
  // Check for active session
  const session = supabase.auth.getSession()
  return !!session?.data?.session
}

// ============================================
// Table-specific Helpers
// ============================================

export const supabaseUsers = {
  /**
   * Find user by email
   */
  findByEmail: async (email: string) => {
    const users = await supabaseQuery<any>('users', { email })
    return users[0] || null
  },

  /**
   * Create user
   */
  create: async (userData: any) => {
    return await supabaseInsert<any>('users', userData)
  },

  /**
   * Update user
   */
  update: async (id: string, updates: any) => {
    return await supabaseUpdate<any>('users', id, updates)
  },

  /**
   * Find by ID
   */
  findById: async (id: string) => {
    const users = await supabaseQuery<any>('users', { id })
    return users[0] || null
  },

  /**
   * Count users
   */
  count: async () => {
    return await supabaseCount('users')
  },
}

export const supabaseProjects = {
  /**
   * Get all projects
   */
  getAll: async () => {
    return await supabaseQuery<any>('projects', {})
  },

  /**
   * Get by owner ID
   */
  getByOwner: async (ownerId: string) => {
    return await supabaseQuery<any>('projects', { ownerId })
  },

  /**
   * Create project
   */
  create: async (projectData: any) => {
    return await supabaseInsert<any>('projects', projectData)
  },

  /**
   * Update project
   */
  update: async (id: string, updates: any) => {
    return await supabaseUpdate<any>('projects', id, updates)
  },

  /**
   * Delete project
   */
  delete: async (id: string) => {
    return await supabaseDelete('projects', id)
  },

  /**
   * Count projects
   */
  count: async () => {
    return await supabaseCount('projects')
  },
}

export const supabaseTasks = {
  /**
   * Get all tasks
   */
  getAll: async () => {
    return await supabaseQuery<any>('tasks', {})
  },

  /**
   * Get by assignee ID
   */
  getByAssignee: async (assigneeId: string) => {
    return await supabaseQuery<any>('tasks', { assignedTo: assigneeId })
  },

  /**
   * Get by project ID
   */
  getByProject: async (projectId: string) => {
    return await supabaseQuery<any>('tasks', { projectId })
  },

  /**
   * Create task
   */
  create: async (taskData: any) => {
    return await supabaseInsert<any>('tasks', taskData)
  },

  /**
   * Update task
   */
  update: async (id: string, updates: any) => {
    return await supabaseUpdate<any>('tasks', id, updates)
  },

  /**
   Delete task
   */
  delete: async (id: string) => {
    return await supabaseDelete('tasks', id)
  },
}

// ============================================
// Row Level Security (RLS) Policy Helpers
// ============================================

/**
 * Check if user is owner of a resource
 */
export async function isResourceOwner(
  userId: string,
  resourceOwnerId: string
): Promise<boolean> {
  return userId === resourceOwnerId
}

/**
 * Check if user is owner or member of a project
 */
export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  // Check if user is owner
  const project = await supabaseQuery<any>('projects', { id: projectId })

  if (project[0]?.ownerId === userId) {
    return true
  }

  // Check if user is a member
  const projectMember = await supabaseQuery<any>('project_members', {
    projectId,
    userId
  })

  return projectMember.length > 0
}

// Export the client for direct access if needed
export default supabase
