import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('=== DATABASE CHECK ===\n')

  // Check projects
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, ownerId: true, status: true, approvalStatus: true, universityId: true, university: { select: { id: true, name: true, code: true } } },
    take: 10,
    orderBy: { createdAt: 'desc' }
  })
  console.log(`Total Projects: ${projects.length}`)
  projects.forEach((p, i) => {
    console.log(`${i + 1}. ${p.id} - ${p.name}`)
    console.log(`   Owner: ${p.ownerId}`)
    console.log(`   University: ${p.university ? p.university.name : 'None'}`)
    console.log(`   Status: ${p.status} | Approval: ${p.approvalStatus}`)
    console.log('')
  })

  // Check users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, universityId: true },
    take: 10
  })
  console.log(`\nTotal Users: ${users.length}`)
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.id} - ${u.name} (${u.email}) - Role: ${u.role} - University: ${u.universityId || 'None'}`)
  })

  // Check tasks
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      projectId: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  })
  console.log(`\nTotal Tasks: ${tasks.length}`)
  tasks.forEach((t, i) => {
    console.log(`${i + 1}. ${t.id} - ${t.title}`)
    console.log(`   Project: ${t.project ? t.project.name : 'None'}`)
    console.log(`   Status: ${t.status}`)
    console.log('')
  })

  // Check task assignees
  const taskAssignees = await prisma.taskAssignee.findMany({
    include: { task: { select: { id: true, title: true } }, user: { select: { id: true, name: true, email: true } } },
    take: 10
  })
  console.log(`\nTotal Task Assignees: ${taskAssignees.length}`)
  taskAssignees.forEach((ta, i) => {
    console.log(`${i + 1}. Task: ${ta.task.id} (${ta.task.title})`)
    console.log(`   Assigned to: ${ta.user.name} (${ta.user.email})`)
    console.log('')
  })

  await prisma.$disconnect()
}

checkDatabase().catch(console.error)
