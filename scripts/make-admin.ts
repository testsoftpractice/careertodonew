import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makePlatformAdmin(email: string) {
  try {
    console.log(`Looking for user with email: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ User not found!')
      console.log('Please create the user first via signup, then run this script again.')
      return
    }

    console.log(`Found user: ${user.name} (${user.role})`)
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'PLATFORM_ADMIN' }
    })

    console.log('✅ User role updated successfully!')
    console.log(`   Name: ${updatedUser.name}`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Role: ${updatedUser.role}`)
    console.log('\nYou can now log in and access the admin approval dashboards at:')
    console.log('  - /admin/approvals/projects')
    console.log('  - /admin/approvals/jobs')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line
const email = process.argv[2]

if (!email) {
  console.log('Usage: bun run make-admin <email@example.com>')
  console.log('Example: bun run make-admin admin@example.com')
  process.exit(1)
}

makePlatformAdmin(email)
