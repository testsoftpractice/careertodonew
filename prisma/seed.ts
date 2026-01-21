import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.leaderboard.deleteMany()
  await prisma.message.deleteMany()
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.businessMember.deleteMany()
  await prisma.business.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.agreement.deleteMany()
  await prisma.verificationRequest.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.workSession.deleteMany()
  await prisma.subTask.deleteMany()
  await prisma.taskDependency.deleteMany()
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.department.deleteMany()
  await prisma.vacancy.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.professionalRecord.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.education.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.user.deleteMany()
  await prisma.university.deleteMany()

  console.log('✅ Database cleaned')

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
  }

  // Create University
  console.log('🏫 Creating University...')
  const university = await prisma.university.create({
    data: {
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
  console.log('✅ University created:', university.name)

  // Create Users
  console.log('👥 Creating users...')
  const hashedPassword = await hashPassword('password123')

  // Student User
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@techuniversity.edu',
      password: hashedPassword,
      name: 'Alex Johnson',
      avatar: null,
      role: 'STUDENT',
      verificationStatus: 'VERIFIED',
      universityId: university.id,
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
  console.log('✅ Student created:', studentUser.name)

  // Mentor User
  const mentorUser = await prisma.user.create({
    data: {
      email: 'mentor@techuniversity.edu',
      password: hashedPassword,
      name: 'Sarah Williams',
      avatar: null,
      role: 'MENTOR',
      verificationStatus: 'VERIFIED',
      universityId: university.id,
      major: 'Software Engineering',
      bio: 'Senior software engineer with 10+ years of experience',
      location: 'New York, NY',
      linkedinUrl: 'https://linkedin.com/in/sarahwilliams',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      executionScore: 4.8,
      collaborationScore: 4.7,
      leadershipScore: 4.5,
      ethicsScore: 4.9,
      reliabilityScore: 4.8,
      progressionLevel: 'PROJECT_LEAD',
    },
  })
  console.log('✅ Mentor created:', mentorUser.name)

  // Employer User
  const employerUser = await prisma.user.create({
    data: {
      email: 'employer@company.com',
      password: hashedPassword,
      name: 'Michael Chen',
      avatar: null,
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
  console.log('✅ Employer created:', employerUser.name)

  // Investor User
  const investorUser = await prisma.user.create({
    data: {
      email: 'investor@vcfirm.com',
      password: hashedPassword,
      name: 'Emily Davis',
      avatar: null,
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
  console.log('✅ Investor created:', investorUser.name)

  // University Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@techuniversity.edu',
      password: hashedPassword,
      name: 'Robert Brown',
      avatar: null,
      role: 'UNIVERSITY_ADMIN',
      verificationStatus: 'VERIFIED',
      universityId: university.id,
      major: 'Education Administration',
      bio: 'University administrator overseeing student programs',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/robertbrown',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      executionScore: 4.7,
      collaborationScore: 4.8,
      leadershipScore: 4.9,
      ethicsScore: 4.8,
      reliabilityScore: 4.9,
      progressionLevel: 'PROJECT_LEAD',
    },
  })
  console.log('✅ University Admin created:', adminUser.name)

  // Create Business for Employer
  console.log('🏢 Creating Business...')
  const business = await prisma.business.create({
    data: {
      name: 'Tech Innovations Inc.',
      description: 'Leading technology company specializing in innovative software solutions',
      industry: 'Technology',
      location: 'San Francisco, CA',
      website: 'https://techinnovations.com',
      logo: null,
      size: '51-200',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      ownerId: employerUser.id,
    },
  })
  console.log('✅ Business created:', business.name)

  // Add Employer to Business
  await prisma.businessMember.create({
    data: {
      businessId: business.id,
      userId: employerUser.id,
      role: 'OWNER',
    },
  })
  console.log('✅ Employer added to business')

  // Create Skills for Student
  console.log('💡 Creating Skills...')
  const skill1 = await prisma.skill.create({
    data: {
      userId: studentUser.id,
      name: 'JavaScript',
      level: 'ADVANCED',
      endorsements: 15,
    },
  })
  const skill2 = await prisma.skill.create({
    data: {
      userId: studentUser.id,
      name: 'TypeScript',
      level: 'INTERMEDIATE',
      endorsements: 8,
    },
  })
  const skill3 = await prisma.skill.create({
    data: {
      userId: studentUser.id,
      name: 'React',
      level: 'ADVANCED',
      endorsements: 12,
    },
  })
  const skill4 = await prisma.skill.create({
    data: {
      userId: studentUser.id,
      name: 'Node.js',
      level: 'INTERMEDIATE',
      endorsements: 7,
    },
  })
  console.log('✅ Skills created for student')

  // Create Experience for Student
  console.log('💼 Creating Experience...')
  await prisma.experience.create({
    data: {
      userId: studentUser.id,
      title: 'Software Developer Intern',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'Developed web applications using React and Node.js',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-09-01'),
      current: false,
      skills: 'JavaScript, React, Node.js',
    },
  })
  await prisma.experience.create({
    data: {
      userId: studentUser.id,
      title: 'Freelance Developer',
      company: 'Self-employed',
      location: 'San Francisco, CA',
      description: 'Built websites and web applications for various clients',
      startDate: new Date('2023-09-15'),
      current: true,
      skills: 'JavaScript, TypeScript, React, Node.js',
    },
  })
  console.log('✅ Experience created for student')

  // Create Education for Student
  console.log('📚 Creating Education...')
  await prisma.education.create({
    data: {
      userId: studentUser.id,
      school: 'Tech University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      description: 'Focus on software development and data structures',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2025-05-01'),
    },
  })
  console.log('✅ Education created for student')

  // Create Projects
  console.log('🚀 Creating Projects...')
  const project1 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform with advanced features',
      status: 'IN_PROGRESS',
      ownerId: employerUser.id,
      businessId: business.id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 50000.0,
      category: 'Web Development',
    },
  })
  console.log('✅ Project 1 created:', project1.name)

  const project2 = await prisma.project.create({
    data: {
      name: 'AI-Powered Analytics Dashboard',
      description: 'Real-time analytics dashboard with AI insights',
      status: 'IDEA',
      ownerId: mentorUser.id,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      budget: 75000.0,
      category: 'AI/ML',
    },
  })
  console.log('✅ Project 2 created:', project2.name)

  const project3 = await prisma.project.create({
    data: {
      name: 'Mobile Health App',
      description: 'Health tracking mobile application for wellness',
      status: 'UNDER_REVIEW',
      ownerId: studentUser.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      budget: 30000.0,
      category: 'Mobile Development',
    },
  })
  console.log('✅ Project 3 created:', project3.name)

  // Add Project Members
  console.log('👥 Adding project members...')
  await prisma.projectMember.create({
    data: {
      projectId: project1.id,
      userId: studentUser.id,
      role: 'TEAM_MEMBER',
    },
  })
  await prisma.projectMember.create({
    data: {
      projectId: project1.id,
      userId: mentorUser.id,
      role: 'PROJECT_MANAGER',
    },
  })
  await prisma.projectMember.create({
    data: {
      projectId: project2.id,
      userId: studentUser.id,
      role: 'TEAM_MEMBER',
    },
  })
  console.log('✅ Project members added')

  // Create Tasks
  console.log('📋 Creating Tasks...')
  const task1 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Design User Authentication System',
      description: 'Implement secure user authentication with JWT tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: studentUser.id,
      assignedBy: employerUser.id,
      dueDate: new Date('2024-02-15'),
      estimatedHours: 8.0,
      actualHours: 6.5,
    },
  })
  const task2 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Implement Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway for checkout',
      status: 'TODO',
      priority: 'CRITICAL',
      assignedTo: studentUser.id,
      assignedBy: mentorUser.id,
      dueDate: new Date('2024-02-20'),
      estimatedHours: 12.0,
    },
  })
  const task3 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Create Product Catalog UI',
      description: 'Design and implement product catalog interface',
      status: 'DONE',
      priority: 'MEDIUM',
      assignedTo: studentUser.id,
      assignedBy: employerUser.id,
      dueDate: new Date('2024-02-01'),
      completedAt: new Date('2024-01-31'),
      estimatedHours: 6.0,
      actualHours: 5.5,
    },
  })
  const task4 = await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Research AI Models',
      description: 'Research and evaluate suitable AI models for analytics',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: studentUser.id,
      assignedBy: mentorUser.id,
      dueDate: new Date('2024-03-15'),
      estimatedHours: 16.0,
    },
  })
  const task5 = await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Build Data Pipeline',
      description: 'Create ETL pipeline for data processing',
      status: 'TODO',
      priority: 'HIGH',
      assignedTo: mentorUser.id,
      assignedBy: mentorUser.id,
      dueDate: new Date('2024-03-30'),
      estimatedHours: 20.0,
    },
  })
  const task6 = await prisma.task.create({
    data: {
      projectId: project3.id,
      title: 'Design App Architecture',
      description: 'Create detailed app architecture document',
      status: 'TODO',
      priority: 'CRITICAL',
      assignedTo: studentUser.id,
      assignedBy: studentUser.id,
      dueDate: new Date('2024-03-01'),
      estimatedHours: 10.0,
    },
  })
  console.log('✅ Tasks created')

  // Create Subtasks
  console.log('📝 Creating Subtasks...')
  await prisma.subTask.create({
    data: {
      taskId: task1.id,
      title: 'Design database schema for users',
      completed: true,
      sortOrder: 1,
    },
  })
  await prisma.subTask.create({
    data: {
      taskId: task1.id,
      title: 'Implement login API endpoint',
      completed: true,
      sortOrder: 2,
    },
  })
  await prisma.subTask.create({
    data: {
      taskId: task1.id,
      title: 'Implement JWT token generation',
      completed: false,
      sortOrder: 3,
    },
  })
  console.log('✅ Subtasks created')

  // Create Milestones
  console.log('🎯 Creating Milestones...')
  await prisma.milestone.create({
    data: {
      projectId: project1.id,
      title: 'Authentication System Complete',
      description: 'Complete user authentication and authorization',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-02-28'),
      metrics: '2/3 tasks completed',
    },
  })
  await prisma.milestone.create({
    data: {
      projectId: project1.id,
      title: 'Payment Integration Complete',
      description: 'Complete payment gateway integration',
      status: 'NOT_STARTED',
      dueDate: new Date('2024-03-15'),
      metrics: '0/1 tasks completed',
    },
  })
  console.log('✅ Milestones created')

  // Create Time Entries
  console.log('⏱️ Creating Time Entries...')
  await prisma.timeEntry.create({
    data: {
      taskId: task1.id,
      userId: studentUser.id,
      date: new Date('2024-02-05'),
      hours: 3.5,
      description: 'Worked on database schema design',
      billable: true,
      hourlyRate: 50.0,
    },
  })
  await prisma.timeEntry.create({
    data: {
      taskId: task1.id,
      userId: studentUser.id,
      date: new Date('2024-02-06'),
      hours: 3.0,
      description: 'Implemented login API',
      billable: true,
      hourlyRate: 50.0,
    },
  })
  await prisma.timeEntry.create({
    data: {
      taskId: task3.id,
      userId: studentUser.id,
      date: new Date('2024-01-30'),
      hours: 5.5,
      description: 'Completed product catalog UI',
      billable: true,
      hourlyRate: 50.0,
    },
  })
  console.log('✅ Time entries created')

  // Create Leave Requests
  console.log('🏖️ Creating Leave Requests...')
  await prisma.leaveRequest.create({
    data: {
      userId: studentUser.id,
      leaveType: 'SICK_LEAVE',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-11'),
      reason: 'Feeling unwell, need rest',
      status: 'APPROVED',
      reviewedBy: mentorUser.id,
      reviewedAt: new Date('2024-02-09'),
    },
  })
  await prisma.leaveRequest.create({
    data: {
      userId: studentUser.id,
      leaveType: 'PERSONAL_LEAVE',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-18'),
      reason: 'Personal family event',
      status: 'PENDING',
    },
  })
  await prisma.leaveRequest.create({
    data: {
      userId: studentUser.id,
      leaveType: 'VACATION',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-07'),
      reason: 'Summer vacation',
      status: 'PENDING',
    },
  })
  console.log('✅ Leave requests created')

  // Create Notifications
  console.log('🔔 Creating Notifications...')
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Design User Authentication System"',
      priority: 'HIGH',
      read: false,
    },
  })
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'PROJECT_UPDATE',
      title: 'Project Update',
      message: 'E-Commerce Platform status changed to IN_PROGRESS',
      priority: 'MEDIUM',
      read: true,
    },
  })
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'INFO',
      title: 'Leave Request Approved',
      message: 'Your sick leave request has been approved',
      priority: 'LOW',
      read: true,
    },
  })
  console.log('✅ Notifications created')

  // Create Ratings
  console.log('⭐ Creating Ratings...')
  await prisma.rating.create({
    data: {
      fromUserId: mentorUser.id,
      toUserId: studentUser.id,
      type: 'EXECUTION',
      score: 5,
      comment: 'Excellent work on the authentication system',
      projectId: project1.id,
    },
  })
  await prisma.rating.create({
    data: {
      fromUserId: employerUser.id,
      toUserId: studentUser.id,
      type: 'COLLABORATION',
      score: 4,
      comment: 'Great team player, always communicates well',
      projectId: project1.id,
    },
  })
  await prisma.rating.create({
    data: {
      fromUserId: mentorUser.id,
      toUserId: studentUser.id,
      type: 'RELIABILITY',
      score: 5,
      comment: 'Always delivers on time with quality work',
    },
  })
  console.log('✅ Ratings created')

  // Create Jobs
  console.log('💼 Creating Jobs...')
  const job1 = await prisma.job.create({
    data: {
      userId: employerUser.id,
      businessId: business.id,
      title: 'Full Stack Developer',
      description: 'We are looking for a talented full stack developer to join our team',
      type: 'FULL_TIME',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      published: true,
      publishedAt: new Date(),
    },
  })
  const job2 = await prisma.job.create({
    data: {
      userId: employerUser.id,
      businessId: business.id,
      title: 'Frontend Developer Intern',
      description: 'Summer internship program for aspiring frontend developers',
      type: 'INTERNSHIP',
      location: 'Remote',
      salary: '$30/hour',
      published: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ Jobs created')

  // Create Job Applications
  console.log('📄 Creating Job Applications...')
  await prisma.jobApplication.create({
    data: {
      jobId: job1.id,
      userId: studentUser.id,
      status: 'PENDING',
    },
  })
  console.log('✅ Job applications created')

  // Create Messages
  console.log('💬 Creating Messages...')
  await prisma.message.create({
    data: {
      fromUserId: employerUser.id,
      toUserId: studentUser.id,
      content: 'Hi Alex, would you be interested in working on our new project?',
      read: false,
    },
  })
  await prisma.message.create({
    data: {
      fromUserId: studentUser.id,
      toUserId: mentorUser.id,
      content: 'Thanks for the feedback on my task submission!',
      read: true,
    },
  })
  console.log('✅ Messages created')

  // Create Leaderboard Entries
  console.log('🏆 Creating Leaderboard Entries...')
  await prisma.leaderboard.create({
    data: {
      userId: studentUser.id,
      category: 'Tasks Completed',
      score: 25.0,
      rank: 3,
    },
  })
  await prisma.leaderboard.create({
    data: {
      userId: studentUser.id,
      category: 'Project Contributions',
      score: 18.0,
      rank: 5,
    },
  })
  console.log('✅ Leaderboard entries created')

  // Create Audit Logs
  console.log('📊 Creating Audit Logs...')
  await prisma.auditLog.create({
    data: {
      userId: studentUser.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: studentUser.id,
      details: 'User logged in',
    },
  })
  await prisma.auditLog.create({
    data: {
      userId: studentUser.id,
      action: 'CREATE',
      entity: 'Task',
      entityId: task1.id,
      details: 'Created new task: Design User Authentication System',
    },
  })
  console.log('✅ Audit logs created')

  // Create Investments
  console.log('💰 Creating Investments...')
  await prisma.investment.create({
    data: {
      userId: investorUser.id,
      projectId: project3.id,
      amount: 50000.0,
      type: 'SEED_FUNDING',
      status: 'APPROVED',
    },
  })
  await prisma.investment.create({
    data: {
      userId: investorUser.id,
      projectId: project2.id,
      amount: 100000.0,
      type: 'SERIES_A',
      status: 'UNDER_REVIEW',
    },
  })
  console.log('✅ Investments created')

  // Create Professional Records
  console.log('📜 Creating Professional Records...')
  await prisma.professionalRecord.create({
    data: {
      userId: studentUser.id,
      recordType: 'CERTIFICATION',
      title: 'AWS Certified Developer',
      description: 'Amazon Web Services Developer Associate Certification',
      startDate: new Date('2023-08-01'),
      verified: true,
    },
  })
  await prisma.professionalRecord.create({
    data: {
      userId: mentorUser.id,
      recordType: 'AWARD',
      title: 'Best Technical Lead 2023',
      description: 'Awarded for exceptional leadership in project delivery',
      startDate: new Date('2023-12-15'),
      verified: true,
    },
  })
  console.log('✅ Professional records created')

  // Create Verification Requests
  console.log('✅ Creating Verification Requests...')
  await prisma.verificationRequest.create({
    data: {
      userId: studentUser.id,
      type: 'IDENTITY',
      status: 'VERIFIED',
      submittedAt: new Date('2023-12-01'),
      reviewedAt: new Date('2023-12-05'),
      notes: 'Identity verified successfully',
      requesterId: adminUser.id,
    },
  })
  await prisma.verificationRequest.create({
    data: {
      userId: studentUser.id,
      type: 'EDUCATION',
      status: 'UNDER_REVIEW',
      submittedAt: new Date('2024-01-10'),
      notes: 'Education verification in progress',
      requesterId: adminUser.id,
    },
  })
  console.log('✅ Verification requests created')

  // Create Agreements
  console.log('📋 Creating Agreements...')
  await prisma.agreement.create({
    data: {
      userId: studentUser.id,
      projectId: project1.id,
      title: 'NDA - E-Commerce Project',
      content: 'Non-disclosure agreement for E-Commerce Platform project',
      signed: true,
      signedAt: new Date('2024-01-15'),
    },
  })
  await prisma.agreement.create({
    data: {
      userId: studentUser.id,
      projectId: project2.id,
      title: 'IP Agreement - AI Dashboard',
      content: 'Intellectual property agreement for AI Analytics Dashboard project',
      signed: false,
    },
  })
  console.log('✅ Agreements created')

  // Create Departments
  console.log('🏢 Creating Departments...')
  await prisma.department.create({
    data: {
      projectId: project1.id,
      name: 'Frontend Team',
      headId: mentorUser.id,
    },
  })
  await prisma.department.create({
    data: {
      projectId: project1.id,
      name: 'Backend Team',
      headId: mentorUser.id,
    },
  })
  await prisma.department.create({
    data: {
      projectId: project2.id,
      name: 'AI/ML Team',
    },
  })
  console.log('✅ Departments created')

  // Create Vacancies
  console.log('📢 Creating Vacancies...')
  await prisma.vacancy.create({
    data: {
      projectId: project1.id,
      title: 'UI/UX Designer',
      description: 'Looking for talented UI/UX designer',
      type: 'FULL_TIME',
      skills: 'Figma, Adobe XD, Prototyping',
      slots: 2,
      filled: 1,
    },
  })
  await prisma.vacancy.create({
    data: {
      projectId: project2.id,
      title: 'ML Engineer',
      description: 'Machine learning engineer for AI analytics',
      type: 'FULL_TIME',
      skills: 'Python, TensorFlow, PyTorch',
      slots: 3,
      filled: 0,
    },
  })
  console.log('✅ Vacancies created')

  // Create Work Sessions
  console.log('⏱️ Creating Work Sessions...')
  await prisma.workSession.create({
    data: {
      userId: studentUser.id,
      startTime: new Date('2024-02-05T09:00:00'),
      endTime: new Date('2024-02-05T12:30:00'),
      duration: 12600, // 3.5 hours in seconds
    },
  })
  await prisma.workSession.create({
    data: {
      userId: studentUser.id,
      startTime: new Date('2024-02-06T10:00:00'),
      endTime: new Date('2024-02-06T13:00:00'),
      duration: 10800, // 3 hours in seconds
    },
  })
  console.log('✅ Work sessions created')

  // Create Task Dependencies
  console.log('🔗 Creating Task Dependencies...')
  await prisma.taskDependency.create({
    data: {
      taskId: task2.id,
      dependsOnId: task1.id,
    },
  })
  await prisma.taskDependency.create({
    data: {
      taskId: task4.id,
      dependsOnId: task2.id,
    },
  })
  console.log('✅ Task dependencies created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📝 Login credentials:')
  console.log('  Student: student@techuniversity.edu / password123')
  console.log('  Mentor: mentor@techuniversity.edu / password123')
  console.log('  Employer: employer@company.com / password123')
  console.log('  Investor: investor@vcfirm.com / password123')
  console.log('  Admin: admin@techuniversity.edu / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
