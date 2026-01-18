import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple database seeding...')

  try {
    // Create one user for testing
    console.log('Creating test user...')
    const user = await prisma.user.create({
      data: {
        email: 'test@demo.com',
        name: 'Test User',
        role: 'STUDENT',
        password: 'hashed_password_123',
        verificationStatus: 'PENDING',
        major: 'Computer Science',
        universityId: 'univ_001',
        graduationYear: 2024,
      }
    })

    console.log('Test user created:', user.id)

    console.log('✅ Database seeded successfully!')
    console.log('📊 Summary:')
    console.log('   - 1 User created')
    console.log('   - Database ready for development')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
