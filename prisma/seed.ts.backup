const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting minimal database seeding...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  try {
    // Create or update university
    const uni1 = await prisma.university.upsert({
      where: { code: 'TECH001' },
      update: {},
      create: {
        name: 'Tech University',
        code: 'TECH001',
        description: 'A leading technology university',
        location: 'San Francisco, CA',
        website: 'https://techuniversity.edu',
        rankingScore: 4.5,
        rankingPosition: 5,
        totalStudents: 25000,
        verificationStatus: 'VERIFIED',
        totalProjects: 150,
      },
    })

    // Create or update students and users
    const student1 = await prisma.user.upsert({
      where: { email: 'student@techuniversity.edu' },
      update: {},
      create: {
        email: 'student@techuniversity.edu',
        password: hashedPassword,
        name: 'Alex Johnson',
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        universityId: uni1.id,
        major: 'Computer Science',
        graduationYear: 2025,
        bio: 'Passionate about building impactful software solutions',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/alexjohnson',
        portfolioUrl: 'https://alexjohnson.dev',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        executionScore: 4.2,
        collaborationScore: 4.5,
        leadershipScore: 3.8,
        ethicsScore: 4.6,
        reliabilityScore: 4.3,
        progressionLevel: 'CONTRIBUTOR',
      },
    })

    await prisma.user.upsert({
      where: { email: 'student2@techuniversity.edu' },
      update: {},
      create: {
        email: 'student2@techuniversity.edu',
        password: hashedPassword,
        name: 'Emma Wilson',
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        universityId: uni1.id,
        major: 'Data Science',
        graduationYear: 2026,
        bio: 'Data science enthusiast with ML experience',
        location: 'Austin, TX',
        linkedinUrl: 'https://linkedin.com/in/emmawilson',
        portfolioUrl: 'https://emmawilson.github.io',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        executionScore: 4.0,
        collaborationScore: 4.2,
        leadershipScore: 3.5,
        ethicsScore: 4.4,
        reliabilityScore: 4.1,
        progressionLevel: 'CONTRIBUTOR',
      },
    })

    const employerUser = await prisma.user.upsert({
      where: { email: 'employer@techinnovations.com' },
      update: {},
      create: {
        email: 'employer@techinnovations.com',
        password: hashedPassword,
        name: 'Michael Chen',
        role: 'EMPLOYER',
        verificationStatus: 'VERIFIED',
        bio: 'CEO of Tech Innovations Inc.',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/michaelchen',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        executionScore: 4.9,
        collaborationScore: 4.6,
        leadershipScore: 4.8,
        ethicsScore: 4.7,
        reliabilityScore: 4.9,
        progressionLevel: 'PROJECT_LEAD',
      },
    })

    const investorUser = await prisma.user.upsert({
      where: { email: 'investor@vcfirm.com' },
      update: {},
      create: {
        email: 'investor@vcfirm.com',
        password: hashedPassword,
        name: 'Emily Davis',
        role: 'INVESTOR',
        verificationStatus: 'VERIFIED',
        bio: 'Angel investor focused on early-stage tech startups',
        location: 'Boston, MA',
        linkedinUrl: 'https://linkedin.com/in/emilydavis',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        executionScore: 4.5,
        collaborationScore: 4.8,
        leadershipScore: 4.7,
        ethicsScore: 4.6,
        reliabilityScore: 4.8,
        progressionLevel: 'SENIOR_CONTRIBUTOR',
      },
    })

    // Create or update business
    const business = await prisma.business.upsert({
      where: { id: 'business-001' },
      update: {},
      create: {
        id: 'business-001',
        name: 'Tech Innovations Inc.',
        description: 'Leading technology company specializing in innovative software solutions',
        industry: 'Technology',
        location: 'San Francisco, CA',
        website: 'https://techinnovations.com',
        size: '51-200',
        status: 'VERIFIED',
        verifiedAt: new Date(),
        ownerId: employerUser.id,
      },
    })

    // Create or update project
    const project1 = await prisma.project.upsert({
      where: {
        id: 'project-ecommerce-001'
      },
      update: {},
      create: {
        id: 'project-ecommerce-001',
        name: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with advanced features',
        status: 'IN_PROGRESS',
        ownerId: employerUser.id,
        businessId: business.id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        budget: 50000,
        category: 'Web Development',
      },
    })

    // Create or update task
    const task1 = await prisma.task.upsert({
      where: {
        id: 'task-auth-001'
      },
      update: {},
      create: {
        id: 'task-auth-001',
        projectId: project1.id,
        title: 'Design User Authentication System',
        description: 'Implement secure user authentication with JWT tokens',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: student1.id,
        assignedBy: employerUser.id,
        dueDate: new Date('2024-02-15'),
        estimatedHours: 8.0,
        actualHours: 6.5,
      },
    })

    // Create or update notification
    await prisma.notification.upsert({
      where: {
        id: 'notification-001'
      },
      update: {},
      create: {
        id: 'notification-001',
        userId: student1.id,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: 'You have been assigned to: Design User Authentication System',
        priority: 'HIGH',
        read: false,
      },
    })

    // Create or update audit log
    await prisma.auditLog.upsert({
      where: {
        id: 'auditlog-001'
      },
      update: {},
      create: {
        id: 'auditlog-001',
        userId: student1.id,
        action: 'CREATE',
        entity: 'Project',
        entityId: project1.id,
        details: 'Created E-Commerce Platform project',
      },
    })

    console.log('Database seeding completed successfully!')
    console.log('\nLogin credentials:')
    console.log('  Student: student@techuniversity.edu / password123')
    console.log('  Student 2: student2@techuniversity.edu / password123')
    console.log('  Employer: employer@techinnovations.com / password123')
    console.log('  Investor: investor@vcfirm.com / password123')

    await prisma.$disconnect()
  } catch (error) {
    console.error('Database seeding failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
