import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjectMemberships() {
  console.log('=== PROJECT MEMBERSHIP CHECK ===\n')

  const projects = await prisma.project.findMany({
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, universityId: true },
          },
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  })

  projects.forEach((p) => {
    console.log(`\nProject: ${p.name} (${p.id})`)
    console.log(`Owner: ${p.ownerId}`)
    console.log(`University: ${p.universityId || 'None'}`)
    console.log(`Members: ${p.members.length}`)

    if (p.members.length === 0) {
      console.log('⚠️  NO MEMBERS! This project cannot be used to create tasks.')
    } else {
      p.members.forEach((m) => {
        console.log(`  - ${m.user.name} (${m.user.email}) - Role: ${m.role}`)
      })
    }
  })

  await prisma.$disconnect()
}

checkProjectMemberships().catch(console.error)
