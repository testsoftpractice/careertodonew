/**
 * Utility function to handle logout consistently across the application
 * Clears all auth data from localStorage, cookies, and redirects to auth page
 */
export async function handleLogout() {
  try {
    // Call the logout API
    await fetch('/api/auth/logout', { method: 'POST' })

    // Clear all auth data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Clear all cookies as well
    const cookies = ['session', 'token', 'user']
    cookies.forEach(cookie => {
      document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `${cookie}=; domain=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })

    return true
  } catch (error) {
    console.error('Logout error:', error)
    return false
  }
}

/**
 * Perform logout and redirect to auth page
 */
export async function logoutAndRedirect() {
  const success = await handleLogout()

  // Force page reload to ensure clean state
  setTimeout(() => {
    window.location.href = '/auth'
  }, 100)

  return success
}

/**
 * Perform logout and redirect to admin login page
 */
export async function adminLogoutAndRedirect() {
  const success = await handleLogout()

  // Force page reload to ensure clean state
  setTimeout(() => {
    window.location.href = '/admin/login'
  }, 100)

  return success
}
