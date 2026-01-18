import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create Universities first
    console.log('🏫 Seeding universities...')
    const universities = []
    for (let i = 1; i <= 5; i++) {
      const university = await prisma.university.upsert({
        where: { code: `UNIV${String(i).padStart(3, '0')}` },
        update: {},
        create: {
          name: `University ${i}`,
          code: `UNIV${String(i).padStart(3, '0')}`,
          description: `Description for University ${i}`,
          verificationStatus: 'VERIFIED',
        },
      })
      universities.push(university)
      console.log(`   ✓ Created/Updated ${university.name}`)
    }

    // Create Users
    console.log('👥 Seeding users...')
    const users = []

    // Create Students
    for (let i = 0; i < 5; i++) {
      const user = await prisma.user.create({
        data: {
          email: `student${i + 1}@example.com`,
          name: `Student ${i + 1}`,
          role: 'STUDENT',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NUyvYvYsYkJe', // 'password123' hashed
          verificationStatus: 'VERIFIED',
          universityId: universities[i % universities.length].id,
          major: 'Computer Science',
          graduationYear: 2025,
        },
      })
      users.push(user)
      console.log(`   ✓ Created ${user.email}`)
    }

    // Create Employers
    for (let i = 0; i < 3; i++) {
      const user = await prisma.user.create({
        data: {
          email: `employer${i + 1}@example.com`,
          name: `Employer ${i + 1}`,
          role: 'EMPLOYER',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NUyvYvYsYkJe',
          verificationStatus: 'VERIFIED',
          companyName: `Company ${i + 1}`,
          position: 'Hiring Manager',
        },
      })
      users.push(user)
      console.log(`   ✓ Created ${user.email}`)
    }

    // Create Investors
    for (let i = 0; i < 2; i++) {
      const user = await prisma.user.create({
        data: {
          email: `investor${i + 1}@example.com`,
          name: `Investor ${i + 1}`,
          role: 'INVESTOR',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NUyvYvYsYkJe',
          verificationStatus: 'VERIFIED',
          firmName: `Venture Firm ${i + 1}`,
          investmentFocus: 'Technology Startups',
        },
      })
      users.push(user)
      console.log(`   ✓ Created ${user.email}`)
    }

    // Create Projects
    console.log('📋 Seeding projects...')
    const projects = []
    for (let i = 0; i < 10; i++) {
      const project = await prisma.project.create({
        data: {
          title: `Project ${i + 1}: ${i < 5 ? 'E-Commerce' : 'SaaS'} Platform`,
          description: `Comprehensive ${i < 5 ? 'e-commerce' : 'software-as-a-service'} platform with modern features`,
          category: i < 5 ? 'E_COMMERCE' : 'STARTUP',
          status: i < 7 ? 'ACTIVE' : 'RECRUITING',
          projectLeadId: users[i % users.length].id,
          universityId: universities[i % universities.length].id,
          completionRate: Math.random() * 100,
          teamSize: Math.floor(Math.random() * 10) + 3,
          seekingInvestment: i % 3 === 0,
          investmentGoal: i % 3 === 0 ? 500000 : null,
          investmentRaised: i % 3 === 0 ? Math.random() * 200000 : 0,
          startDate: new Date(),
        },
      })
      projects.push(project)
      console.log(`   ✓ Created ${project.title}`)
    }

    // Create Tasks
    console.log('📝 Seeding tasks...')
    for (let i = 0; i < 20; i++) {
      const task = await prisma.task.create({
        data: {
          title: `Task ${i + 1}`,
          description: `Complete task ${i + 1} for the project`,
          status: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 4)] as any,
          priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
          projectId: projects[i % projects.length].id,
          assigneeId: users[Math.floor(Math.random() * users.length)].id,
          creatorId: users[0].id,
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      })
      console.log(`   ✓ Created ${task.title}`)
    }

    // Create Professional Records
    console.log('📋 Seeding professional records...')
    for (const user of users) {
      await prisma.professionalRecord.create({
        data: {
          userId: user.id,
          type: 'SKILL_ACQUIRED',
          title: 'Platform Registration',
          description: `Registered as ${user.role} on CareerToDo Platform`,
          startDate: new Date(),
          hash: `reg-${user.id}-${Date.now()}`,
        },
      })
    }
    console.log(`   ✓ Created ${users.length} professional records`)

    // Create Project Members
    console.log('👥 Seeding project memberships...')
    for (let i = 0; i < 15; i++) {
      await prisma.projectMember.create({
        data: {
          projectId: projects[i % projects.length].id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          role: ['CONTRIBUTOR', 'TEAM_LEAD', 'MENTOR'][Math.floor(Math.random() * 3)] as any,
          startDate: new Date(),
        },
      })
    }
    console.log('   ✓ Created 15 project memberships')

    console.log('✅ Database seeded successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${universities.length} Universities`)
    console.log(`   - ${users.length} Users (5 Students, 3 Employers, 2 Investors)`)
    console.log(`   - ${projects.length} Projects`)
    console.log(`   - 20 Tasks`)
    console.log(`   - ${users.length} Professional Records`)
    console.log(`   - 15 Project Memberships`)
    console.log(`   - Total: ${universities.length + users.length + projects.length + 20 + users.length + 15} entities created`)
    console.log('   ')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
