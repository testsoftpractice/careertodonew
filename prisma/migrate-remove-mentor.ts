const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration: Remove MENTOR role...')

  try {
    // Update all users with MENTOR role to STUDENT
    const result = await prisma.user.updateMany({
      where: {
        role: 'MENTOR'
      },
      data: {
        role: 'STUDENT'
      }
    })

    console.log(`✅ Updated ${result.count} users from MENTOR to STUDENT role`)

    // Display the affected users
    const updatedUsers = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log('\nUsers with updated role:')
    updatedUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`)
    })

    console.log('\n✅ Migration completed successfully!')
    console.log('You can now run: npm run db:push')

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
