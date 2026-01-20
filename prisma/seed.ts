import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data (delete in correct order to respect foreign keys)
  await prisma.timeEntry.deleteMany()
  await prisma.workSession.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.agreement.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.subTask.deleteMany()
  await prisma.taskDependency.deleteMany()
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.department.deleteMany()
  await prisma.vacancy.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.education.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.verificationRequest.deleteMany()
  await prisma.professionalRecord.deleteMany()
  await prisma.leaderboard.deleteMany()
  await prisma.user.deleteMany()
  await prisma.university.deleteMany()
  await prisma.businessMember.deleteMany()
  await prisma.business.deleteMany()

  console.log('✅ Cleared existing data')

  // Create Universities
  const universitiesData = [
    {
      name: 'Stanford University',
      code: 'STAN',
      description: 'Leading research university in Silicon Valley',
      location: 'Stanford, CA',
      rankingScore: 98.5,
      rankingPosition: 3,
      totalStudents: 17000,
      verificationStatus: 'VERIFIED',
      totalProjects: 0,
    },
    {
      name: 'MIT',
      code: 'MIT',
      description: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
      rankingScore: 99.2,
      rankingPosition: 1,
      totalStudents: 11500,
      verificationStatus: 'VERIFIED',
      totalProjects: 0,
    },
    {
      name: 'Harvard University',
      code: 'HARV',
      description: 'Ivy League research university',
      location: 'Cambridge, MA',
      rankingScore: 98.8,
      rankingPosition: 2,
      totalStudents: 23000,
      verificationStatus: 'VERIFIED',
      totalProjects: 0,
    },
    {
      name: 'UC Berkeley',
      code: 'UCB',
      description: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      rankingScore: 96.5,
      rankingPosition: 8,
      totalStudents: 45000,
      verificationStatus: 'VERIFIED',
      totalProjects: 0,
    },
    {
      name: 'Carnegie Mellon',
      code: 'CMU',
      description: 'Top computer science and engineering school',
      location: 'Pittsburgh, PA',
      rankingScore: 97.2,
      rankingPosition: 5,
      totalStudents: 14000,
      verificationStatus: 'VERIFIED',
      totalProjects: 0,
    },
  ]

  const universities = await prisma.university.createMany({
    data: universitiesData,
  })
  console.log(`✅ Created ${universities.count} universities`)

  // Get created universities to use as references
  const createdUniversities = await prisma.university.findMany({
    orderBy: { code: 'asc' },
  })
  console.log(`✅ Fetched ${createdUniversities.length} universities for seeding`)

  // Create Users
  const bcrypt = require('bcryptjs')

  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
  }

  const usersData = [
    {
      email: 'student1@demo.edu',
      password: await hashPassword('demo123'),
      name: 'Emily Chen',
      role: 'STUDENT',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=random',
      universityId: createdUniversities[0].id,
      major: 'Computer Science',
      graduationYear: 2025,
      bio: 'Passionate about AI and machine learning',
      location: 'San Francisco, CA',
      linkedinUrl: 'linkedin.com/in/emilychen',
      portfolioUrl: 'portfolio.emilychen.dev',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      verificationStatus: 'VERIFIED',
      executionScore: 4.2,
      collaborationScore: 4.5,
      leadershipScore: 3.8,
      ethicsScore: 4.7,
      reliabilityScore: 4.3,
      progressionLevel: 'CONTRIBUTOR',
    },
    {
      email: 'student2@demo.edu',
      password: await hashPassword('demo123'),
      name: 'James Wilson',
      role: 'STUDENT',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=random',
      universityId: createdUniversities[1].id,
      major: 'Electrical Engineering',
      graduationYear: 2024,
      bio: 'Robotics enthusiast',
      location: 'Boston, MA',
      linkedinUrl: 'linkedin.com/in/jameswilson',
      verificationStatus: 'VERIFIED',
      executionScore: 3.8,
      collaborationScore: 4.2,
      leadershipScore: 4.1,
      ethicsScore: 4.5,
      reliabilityScore: 4.0,
      progressionLevel: 'CONTRIBUTOR',
    },
    {
      email: 'university@careertodo.com',
      password: await hashPassword('admin123'),
      name: 'Dr. Sarah Martinez',
      role: 'UNIVERSITY_ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=random',
      universityId: createdUniversities[0].id,
      verificationStatus: 'VERIFIED',
      executionScore: 4.8,
      collaborationScore: 4.9,
      leadershipScore: 5.0,
      ethicsScore: 5.0,
      reliabilityScore: 4.8,
    },
    {
      email: 'employer@careertodo.com',
      password: await hashPassword('demo123'),
      name: 'Tech Ventures Inc.',
      role: 'EMPLOYER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechVentures&backgroundColor=random',
      verificationStatus: 'VERIFIED',
    },
    {
      email: 'investor@careertodo.com',
      password: await hashPassword('demo123'),
      name: 'Apex Ventures',
      role: 'INVESTOR',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ApexVentures&backgroundColor=random',
      verificationStatus: 'VERIFIED',
    },
    {
      email: 'admin@careertodo.com',
      password: await hashPassword('admin123'),
      name: 'Platform Administrator',
      role: 'PLATFORM_ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=random',
      verificationStatus: 'VERIFIED',
    },
  ]

  const users = await prisma.user.createMany({
    data: usersData,
  })
  console.log(`✅ Created ${usersData.length} users`)

  // Get created users to use as references
  const createdUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })
  console.log(`✅ Fetched ${createdUsers.length} users for seeding`)

  // Create Skills
  const skillsData = [
    { userId: createdUsers[0].id, name: 'React', level: 'EXPERT' },
    { userId: createdUsers[0].id, name: 'TypeScript', level: 'ADVANCED' },
    { userId: createdUsers[0].id, name: 'Node.js', level: 'INTERMEDIATE' },
    { userId: createdUsers[1].id, name: 'Python', level: 'EXPERT' },
    { userId: createdUsers[1].id, name: 'Machine Learning', level: 'ADVANCED' },
  ]

  await prisma.skill.createMany({
    data: skillsData,
  })
  console.log(`✅ Created ${skillsData.length} skills`)

  // Create Businesses
  const businessesData = [
    {
      name: 'Tech Ventures Inc.',
      description: 'Innovative technology company focused on AI and machine learning solutions',
      industry: 'Technology',
      location: 'San Francisco, CA',
      website: 'https://techventures.com',
      size: '51-200',
      status: 'VERIFIED',
      ownerId: createdUsers[3].id, // Employer user
      verifiedAt: new Date(),
    },
  ]

  const businesses = await prisma.business.createMany({
    data: businessesData,
  })
  console.log(`✅ Created ${businessesData.length} businesses`)

  // Get created businesses
  const createdBusinesses = await prisma.business.findMany()

  // Create Business Members
  const businessMembersData = [
    {
      businessId: createdBusinesses[0].id,
      userId: createdUsers[0].id, // Emily Chen as a team member
      role: 'TEAM_MEMBER',
    },
    {
      businessId: createdBusinesses[0].id,
      userId: createdUsers[1].id, // James Wilson as a project manager
      role: 'PROJECT_MANAGER',
    },
  ]

  await prisma.businessMember.createMany({
    data: businessMembersData,
  })
  console.log(`✅ Created ${businessMembersData.length} business members`)

  // Create Projects
  const projectsData = [
    {
      name: 'AI-Powered Learning Platform',
      description: 'An intelligent educational platform using AI to personalize learning experiences',
      ownerId: createdUsers[0].id,
      businessId: createdBusinesses[0].id, // Link to business
      status: 'IN_PROGRESS',
      category: 'Education Technology',
      budget: 50000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Smart Home Automation System',
      description: 'IoT-based home automation system with voice control',
      ownerId: createdUsers[1].id,
      status: 'FUNDING',
      category: 'IoT',
      budget: 75000,
    },
    {
      name: 'E-commerce Marketplace',
      description: 'Multi-vendor marketplace with advanced features',
      ownerId: createdUsers[0].id,
      status: 'IDEA',
      category: 'E-commerce',
    },
  ]

  const projects = await prisma.project.createMany({
    data: projectsData,
  })
  console.log(`✅ Created ${projects.count} projects`)

  // Get created projects
  const createdProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // Create Project Members
  const projectMembersData = [
    {
      projectId: createdProjects[0].id,
      userId: createdUsers[1].id, // James as PROJECT_MANAGER
      role: 'PROJECT_MANAGER',
    },
    {
      projectId: createdProjects[0].id,
      userId: createdUsers[0].id, // Emily as TEAM_MEMBER
      role: 'TEAM_MEMBER',
    },
  ]

  await prisma.projectMember.createMany({
    data: projectMembersData,
  })
  console.log(`✅ Created ${projectMembersData.length} project members`)

  // Create Tasks
  const tasksData = [
    {
      title: 'Design System Architecture',
      description: 'Create scalable architecture for the learning platform',
      projectId: createdProjects[0].id,
      assignedTo: createdUsers[0].id,
      assignedBy: createdUsers[0].id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHours: 40,
      actualHours: 25,
    },
    {
      title: 'Implement Authentication System',
      description: 'Build secure auth system with JWT tokens',
      projectId: createdProjects[0].id,
      assignedTo: createdUsers[0].id,
      assignedBy: createdUsers[0].id,
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHours: 32,
    },
    {
      title: 'Develop Mobile App',
      description: 'Create mobile applications for iOS and Android',
      projectId: createdProjects[0].id,
      assignedTo: createdUsers[1].id,
      assignedBy: createdUsers[0].id,
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 48,
      actualHours: 45,
      completedAt: new Date(),
    },
  ]

  const tasks = await prisma.task.createMany({
    data: tasksData,
  })
  console.log(`✅ Created ${tasks.count} tasks`)

  // Get created tasks
  const createdTasks = await prisma.task.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // Create Notifications
  const notificationsData = [
    {
      userId: createdUsers[0].id,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: `You have been assigned to: ${createdTasks[0].title}`,
      priority: 'HIGH',
      read: false,
    },
    {
      userId: createdUsers[0].id,
      type: 'PROJECT_UPDATE',
      title: 'Project Update',
      message: `Project ${createdProjects[0].name} status changed to In Progress`,
      priority: 'MEDIUM',
      read: false,
    },
    {
      userId: createdUsers[0].id,
      type: 'SUCCESS',
      title: 'Task Completed',
      message: `Congratulations! You completed: ${createdTasks[2].title}`,
      priority: 'LOW',
      read: false,
    },
  ]

  await prisma.notification.createMany({
    data: notificationsData,
  })
  console.log(`✅ Created ${notificationsData.length} notifications`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
