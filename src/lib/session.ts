import { cookies } from 'next/headers'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

export interface Session {
  user: SessionUser
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const userCookie = cookieStore.get('user')?.value

    if (!token || !userCookie) {
      return null
    }

    const user = JSON.parse(userCookie) as SessionUser

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('[Session] Error getting server session:', error)
    return null
  }
}
