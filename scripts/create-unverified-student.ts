import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth/jwt'

async function createUnverifiedStudent() {
  try {
    console.log('Creating unverified test student...')

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'unverified@student.com' },
    })

    if (existingUser) {
      console.log('Unverified student already exists:', existingUser.email)
      console.log('Password: test123456')
      console.log('Role:', existingUser.role)
      console.log('Verification Status:', existingUser.verificationStatus)
      return
    }

    // Create unverified student
    const password = await hashPassword('test123456')

    const user = await db.user.create({
      data: {
        email: 'unverified@student.com',
        password,
        name: 'Unverified Student',
        role: 'STUDENT',
        verificationStatus: 'PENDING', // Unverified student
        major: 'Computer Science',
        graduationYear: 2025,
        bio: 'Unverified student for testing payment flow',
      },
    })

    console.log('✅ Unverified student created successfully!')
    console.log('Email:', user.email)
    console.log('Password: test123456')
    console.log('Role:', user.role)
    console.log('Verification Status:', user.verificationStatus)
    console.log('User ID:', user.id)
  } catch (error) {
    console.error('Error creating unverified student:', error)
  } finally {
    await db.$disconnect()
  }
}

createUnverifiedStudent()
