import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth/jwt'

async function createTestUser() {
  try {
    console.log('Creating test user...')

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'test@student.com' },
    })

    if (existingUser) {
      console.log('Test user already exists:', existingUser.email)
      console.log('Password: test123456')
      console.log('Role:', existingUser.role)
      console.log('Verification Status:', existingUser.verificationStatus)
      return
    }

    // Create test student user (verified)
    const password = await hashPassword('test123456')

    const user = await db.user.create({
      data: {
        email: 'test@student.com',
        password,
        name: 'Test Student',
        role: 'STUDENT',
        verificationStatus: 'VERIFIED', // Verified student
        major: 'Computer Science',
        graduationYear: 2025,
        bio: 'Test student for authentication testing',
      },
    })

    console.log('✅ Test user created successfully!')
    console.log('Email:', user.email)
    console.log('Password: test123456')
    console.log('Role:', user.role)
    console.log('Verification Status:', user.verificationStatus)
    console.log('User ID:', user.id)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await db.$disconnect()
  }
}

createTestUser()
