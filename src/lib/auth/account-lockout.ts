import { db } from '@/lib/db'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 60 * 1000 // 30 minutes

export interface LockoutStatus {
  locked: boolean
  attempts: number
  remainingTime?: number
}

export async function checkAndIncrementLoginAttempts(userId: string): Promise<LockoutStatus> {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return { locked: false, attempts: 0 }
  }

  // Check if account is locked
  if (user.lockedAt && user.lockedAt > new Date(Date.now() - LOCKOUT_DURATION_MS)) {
    const remainingTime = Math.ceil((user.lockedAt.getTime() - (Date.now() - LOCKOUT_DURATION_MS)) / 60000)
    return {
      locked: true,
      attempts: user.loginAttempts,
      remainingTime,
    }
  }

  // Reset attempts if lockout period has passed
  if (user.lockedAt && user.lockedAt <= new Date(Date.now() - LOCKOUT_DURATION_MS)) {
    await db.user.update({
      where: { id: userId },
      data: { loginAttempts: 0, lockedAt: null },
    })
    return { locked: false, attempts: user.loginAttempts }
  }

  return { locked: false, attempts: user.loginAttempts || 0 }
}

export async function handleFailedLogin(userId: string): Promise<void> {
  const { attempts } = await checkAndIncrementLoginAttempts(userId)

  if (attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
    await db.user.update({
      where: { id: userId },
      data: {
        loginAttempts: attempts + 1,
        lockedAt: new Date(),
      },
    })
  } else {
    await db.user.update({
      where: { id: userId },
      data: { loginAttempts: attempts + 1 },
    })
  }
}

export async function resetLoginAttempts(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { loginAttempts: 0, lockedAt: null },
  })
}
