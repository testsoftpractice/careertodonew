const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  try {
    // Clear existing data (in correct order to respect foreign keys)
    console.log('🗑️  Cleaning existing data...')
    await prisma.workSession.deleteMany()
    await prisma.timeEntry.deleteMany()
    await prisma.subTask.deleteMany()
    await prisma.taskDependency.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.pointTransaction.deleteMany()
    await prisma.rating.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.jobApplication.deleteMany()
    await prisma.job.deleteMany()
    await prisma.verificationRequest.deleteMany()
    await prisma.agreement.deleteMany()
    await prisma.investment.deleteMany()
    await prisma.milestone.deleteMany()
    await prisma.vacancy.deleteMany()
    await prisma.department.deleteMany()
    await prisma.task.deleteMany()
    await prisma.projectMember.deleteMany()
    await prisma.project.deleteMany()
    await prisma.leaveRequest.deleteMany()
    await prisma.professionalRecord.deleteMany()
    await prisma.education.deleteMany()
    await prisma.experience.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.message.deleteMany()
    await prisma.businessMember.deleteMany()
    await prisma.business.deleteMany()
    await prisma.user.deleteMany()
    await prisma.university.deleteMany()

    console.log('✅ Existing data cleared')

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password123!', 10)
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    console.log('📚 Creating universities...')
    // Create Universities
    const universities = await Promise.all([
      prisma.university.create({
        data: {
          name: 'Stanford University',
          code: 'STAN001',
          description: 'Private research university in California',
          location: 'Stanford, CA',
          website: 'https://stanford.edu',
          rankingScore: 4.8,
          rankingPosition: 3,
          totalStudents: 17000,
          verificationStatus: 'VERIFIED',
          totalProjects: 45
        }
      }),
      prisma.university.create({
        data: {
          name: 'Massachusetts Institute of Technology',
          code: 'MIT001',
          description: 'Private research university in Massachusetts',
          location: 'Cambridge, MA',
          website: 'https://mit.edu',
          rankingScore: 4.9,
          rankingPosition: 1,
          totalStudents: 11500,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of California, Berkeley',
          code: 'UCB001',
          description: 'Public research university in California',
          location: 'Berkeley, CA',
          website: 'https://berkeley.edu',
          rankingScore: 4.7,
          rankingPosition: 4,
          totalStudents: 45000,
          verificationStatus: 'VERIFIED',
          totalProjects: 67
        }
      }),
      prisma.university.create({
        data: {
          name: 'Carnegie Mellon University',
          code: 'CMU001',
          description: 'Private research university in Pennsylvania',
          location: 'Pittsburgh, PA',
          website: 'https://cmu.edu',
          rankingScore: 4.6,
          rankingPosition: 6,
          totalStudents: 15000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Georgia Institute of Technology',
          code: 'GT001',
          description: 'Public research university in Georgia',
          location: 'Atlanta, GA',
          website: 'https://gatech.edu',
          rankingScore: 4.5,
          rankingPosition: 8,
          totalStudents: 40000,
          verificationStatus: 'VERIFIED',
          totalProjects: 29
        }
      })
    ])

    console.log('✅ Created', universities.length, 'universities')

    console.log('👥 Creating users...')
    // Create Users with all roles
    const students = await Promise.all([
      prisma.user.create({
        data: {
          email: 'student.stanford@edu.com',
          password: hashedPassword,
          name: 'Alex Johnson',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[0].id,
          major: 'Computer Science',
          graduationYear: 2025,
          bio: 'Passionate software engineer interested in AI and machine learning',
          location: 'Stanford, CA',
          linkedinUrl: 'https://linkedin.com/in/alexjohnson',
          portfolioUrl: 'https://alexjohnson.dev',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.2,
          collaborationScore: 4.5,
          leadershipScore: 3.8,
          ethicsScore: 4.6,
          reliabilityScore: 4.3,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 250
        }
      }),
      prisma.user.create({
        data: {
          email: 'student.mit@edu.com',
          password: hashedPassword,
          name: 'Emily Chen',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[1].id,
          major: 'Electrical Engineering & Computer Science',
          graduationYear: 2026,
          bio: 'Hardware enthusiast and software developer',
          location: 'Cambridge, MA',
          linkedinUrl: 'https://linkedin.com/in/emilychen',
          portfolioUrl: 'https://emilychen.github.io',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.2,
          leadershipScore: 3.5,
          ethicsScore: 4.7,
          reliabilityScore: 4.4,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 380
        }
      }),
      prisma.user.create({
        data: {
          email: 'student.berkeley@edu.com',
          password: hashedPassword,
          name: 'Marcus Williams',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[2].id,
          major: 'Data Science',
          graduationYear: 2025,
          bio: 'Data science student focusing on ML and big data analytics',
          location: 'Berkeley, CA',
          linkedinUrl: 'https://linkedin.com/in/marcuswilliams',
          portfolioUrl: 'https://marcuswilliams.dev',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.0,
          collaborationScore: 4.8,
          leadershipScore: 4.2,
          ethicsScore: 4.5,
          reliabilityScore: 4.1,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 520
        }
      }),
      prisma.user.create({
        data: {
          email: 'student.cmu@edu.com',
          password: hashedPassword,
          name: 'Sophia Rodriguez',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[3].id,
          major: 'Software Engineering',
          graduationYear: 2026,
          bio: 'Full-stack developer with interest in distributed systems',
          location: 'Pittsburgh, PA',
          linkedinUrl: 'https://linkedin.com/in/sophiarodriguez',
          portfolioUrl: 'https://sophiarodriguez.com',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.3,
          collaborationScore: 4.4,
          leadershipScore: 3.9,
          ethicsScore: 4.4,
          reliabilityScore: 4.2,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 180
        }
      }),
      prisma.user.create({
        data: {
          email: 'student.gt@edu.com',
          password: hashedPassword,
          name: 'James Park',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[4].id,
          major: 'Industrial Design',
          graduationYear: 2025,
          bio: 'Design thinking and product development enthusiast',
          location: 'Atlanta, GA',
          linkedinUrl: 'https://linkedin.com/in/jamespark',
          portfolioUrl: 'https://jamespark.design',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.1,
          collaborationScore: 4.6,
          leadershipScore: 4.0,
          ethicsScore: 4.3,
          reliabilityScore: 4.0,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 220
        }
      })
    ])

    const employers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'employer@techcorp.com',
          password: hashedPassword,
          name: 'Michael Thompson',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: null,
          graduationYear: null,
          bio: 'CEO of TechCorp with 15 years of experience in technology industry',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/michaelthompson',
          portfolioUrl: 'https://techcorp.com',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.8,
          collaborationScore: 4.5,
          leadershipScore: 4.9,
          ethicsScore: 4.7,
          reliabilityScore: 4.6,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 1200
        }
      }),
      prisma.user.create({
        data: {
          email: 'hr@innovatech.com',
          password: hashedPassword,
          name: 'Sarah Martinez',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Human Resources',
          graduationYear: 2018,
          bio: 'HR Director at InnovateCH, passionate about talent acquisition',
          location: 'Boston, MA',
          linkedinUrl: 'https://linkedin.com/in/sarahmartinez',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.2,
          collaborationScore: 4.8,
          leadershipScore: 4.4,
          ethicsScore: 4.5,
          reliabilityScore: 4.3,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 850
        }
      }),
      prisma.user.create({
        data: {
          email: 'manager@startuphub.com',
          password: hashedPassword,
          name: 'David Kim',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Business Administration',
          graduationYear: 2019,
          bio: 'Engineering Manager at StartupHub, overseeing 5 teams',
          location: 'Seattle, WA',
          linkedinUrl: 'https://linkedin.com/in/davidkim',
          portfolioUrl: 'https://davidkim.tech',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.3,
          leadershipScore: 4.6,
          ethicsScore: 4.4,
          reliabilityScore: 4.2,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 680
        }
      })
    ])

    const investors = await Promise.all([
      prisma.user.create({
        data: {
          email: 'investor@venturefund.com',
          password: hashedPassword,
          name: 'Richard Anderson',
          avatar: null,
          role: 'INVESTOR',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Finance',
          graduationYear: 2015,
          bio: 'Venture capitalist with 20 years of investment experience in tech startups',
          location: 'New York, NY',
          linkedinUrl: 'https://linkedin.com/in/richardanderson',
          portfolioUrl: 'https://venturefund.com/richard',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.6,
          collaborationScore: 4.4,
          leadershipScore: 4.8,
          ethicsScore: 4.6,
          reliabilityScore: 4.5,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 950
        }
      }),
      prisma.user.create({
        data: {
          email: 'angel@seedfund.com',
          password: hashedPassword,
          name: 'Jennifer Lee',
          avatar: null,
          role: 'INVESTOR',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Business Administration',
          graduationYear: 2017,
          bio: 'Angel investor focusing on early-stage tech and healthcare startups',
          location: 'Los Angeles, CA',
          linkedinUrl: 'https://linkedin.com/in/jenniferlee',
          portfolioUrl: 'https://seedfund.com/jennifer',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.3,
          collaborationScore: 4.7,
          leadershipScore: 4.2,
          ethicsScore: 4.8,
          reliabilityScore: 4.4,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 420
        }
      }),
      prisma.user.create({
        data: {
          email: 'partner@growthcapital.com',
          password: hashedPassword,
          name: 'Robert Chen',
          avatar: null,
          role: 'INVESTOR',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Computer Science',
          graduationYear: 2016,
          bio: 'Partner at Growth Capital, specializing in Series A and B funding rounds',
          location: 'Chicago, IL',
          linkedinUrl: 'https://linkedin.com/in/robertchen',
          portfolioUrl: 'https://growthcapital.com/robert',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.7,
          collaborationScore: 4.5,
          leadershipScore: 4.9,
          ethicsScore: 4.7,
          reliabilityScore: 4.6,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 890
        }
      })
    ])

    const universityAdmins = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin.stanford@stanford.edu',
          password: hashedPassword,
          name: 'Dr. William Foster',
          avatar: null,
          role: 'UNIVERSITY_ADMIN',
          verificationStatus: 'VERIFIED',
          universityId: universities[0].id,
          major: 'Computer Science PhD',
          graduationYear: 2010,
          bio: 'Dean of Engineering at Stanford, overseeing 50+ research projects',
          location: 'Stanford, CA',
          linkedinUrl: 'https://linkedin.com/in/drwilliamfoster',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.2,
          leadershipScore: 4.9,
          ethicsScore: 4.8,
          reliabilityScore: 4.7,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 1800
        }
      }),
      prisma.user.create({
        data: {
          email: 'admin.mit@mit.edu',
          password: hashedPassword,
          name: 'Dr. Patricia Moore',
          avatar: null,
          role: 'UNIVERSITY_ADMIN',
          verificationStatus: 'VERIFIED',
          universityId: universities[1].id,
          major: 'Computer Science PhD',
          graduationYear: 2012,
          bio: 'Associate Dean of Computer Science, managing research grants and collaborations',
          location: 'Cambridge, MA',
          linkedinUrl: 'https://linkedin.com/in/drpatriciamoore',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.4,
          collaborationScore: 4.6,
          leadershipScore: 4.7,
          ethicsScore: 4.6,
          reliabilityScore: 4.5,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 950
        }
      }),
      prisma.user.create({
        data: {
          email: 'admin.berkeley@berkeley.edu',
          password: hashedPassword,
          name: 'Prof. James Wilson',
          avatar: null,
          role: 'UNIVERSITY_ADMIN',
          verificationStatus: 'VERIFIED',
          universityId: universities[2].id,
          major: 'Data Science PhD',
          graduationYear: 2013,
          bio: 'Director of Innovation Center, fostering industry partnerships',
          location: 'Berkeley, CA',
          linkedinUrl: 'https://linkedin.com/in/profjameswilson',
          portfolioUrl: 'https://wilsonresearch.berkeley.edu',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.1,
          collaborationScore: 4.9,
          leadershipScore: 4.5,
          ethicsScore: 4.7,
          reliabilityScore: 4.3,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 1450
        }
      })
    ])

    const platformAdmin = await prisma.user.create({
      data: {
        email: 'admin@careertodo.com',
        password: hashedPassword,
        name: 'System Administrator',
        avatar: null,
        role: 'PLATFORM_ADMIN',
        verificationStatus: 'VERIFIED',
        universityId: null,
        major: null,
        graduationYear: null,
        bio: 'Platform administrator managing all system operations',
        location: 'Remote',
        linkedinUrl: null,
        portfolioUrl: null,
        emailVerified: true,
        emailVerifiedAt: yesterday,
        executionScore: 5.0,
        collaborationScore: 5.0,
        leadershipScore: 5.0,
        ethicsScore: 5.0,
        reliabilityScore: 5.0,
        progressionLevel: 'PROJECT_LEAD',
        totalPoints: 5000
      }
    })

    console.log('✅ Created', students.length + employers.length + investors.length + universityAdmins.length + 1, 'users')

    console.log('💼 Creating businesses...')
    // Create Businesses
    const businesses = await Promise.all([
      prisma.business.create({
        data: {
          name: 'TechCorp Solutions',
          description: 'Enterprise technology solutions provider serving Fortune 500 companies',
          industry: 'Technology',
          location: 'San Francisco, CA',
          website: 'https://techcorp.com',
          size: '51-200',
          status: 'VERIFIED',
          verifiedAt: yesterday,
          ownerId: employers[0].id
        }
      }),
      prisma.business.create({
        data: {
          name: 'InnovateCH Inc.',
          description: 'Innovation consulting and digital transformation company',
          industry: 'Consulting',
          location: 'Boston, MA',
          website: 'https://innovatech.com',
          size: '11-50',
          status: 'VERIFIED',
          verifiedAt: yesterday,
          ownerId: employers[1].id
        }
      }),
      prisma.business.create({
        data: {
          name: 'StartupHub',
          description: 'Early-stage startup incubator and accelerator',
          industry: 'Startup',
          location: 'Seattle, WA',
          website: 'https://startuphub.io',
          size: '1-10',
          status: 'VERIFIED',
          verifiedAt: yesterday,
          ownerId: employers[2].id
        }
      })
    ])

    console.log('✅ Created', businesses.length, 'businesses')

    // Add business members
    console.log('👥 Adding business members...')
    await Promise.all([
      prisma.businessMember.create({
        data: {
          businessId: businesses[0].id,
          userId: employers[0].id,
          role: 'OWNER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[0].id,
          userId: employers[1].id,
          role: 'HR_MANAGER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[0].id,
          userId: students[0].id,
          role: 'PROJECT_MANAGER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[1].id,
          userId: employers[1].id,
          role: 'OWNER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[1].id,
          userId: students[2].id,
          role: 'RECRUITER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[2].id,
          userId: employers[2].id,
          role: 'OWNER'
        }
      }),
      prisma.businessMember.create({
        data: {
          businessId: businesses[2].id,
          userId: students[3].id,
          role: 'TEAM_LEAD'
        }
      })
    ])

    console.log('✅ Created 6 business members')

    console.log('🎓 Creating skills...')
    // Create Skills for students
    const skillsData = [
      // Skills for Alex Johnson
      ...['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'Docker', 'Git', 'Agile'].map(name => ({
        userId: students[0].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 20) + 5
      })),
      // Skills for Emily Chen
      ...['Electrical Engineering', 'Embedded Systems', 'C++', 'Python', 'MATLAB', 'Circuit Design', 'VHDL', 'Linux', 'Testing'].map(name => ({
        userId: students[1].id,
        name,
        level: 'EXPERT',
        endorsements: Math.floor(Math.random() * 25) + 10
      })),
      // Skills for Marcus Williams
      ...['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'SQL', 'Data Visualization', 'Statistics'].map(name => ({
        userId: students[2].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 15) + 8
      })),
      // Skills for Sophia Rodriguez
      ...['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'REST APIs', 'Microservices'].map(name => ({
        userId: students[3].id,
        name,
        level: 'INTERMEDIATE',
        endorsements: Math.floor(Math.random() * 12) + 3
      })),
      // Skills for James Park
      ...['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Thinking', 'Illustrator', 'Design Systems', 'UI Design'].map(name => ({
        userId: students[4].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 18) + 6
      }))
    ]

    const skills = await Promise.all(skillsData.map(skill => 
      prisma.skill.create({ data: skill })
    ))

    console.log('✅ Created', skills.length, 'skills')

    console.log('💼 Creating experiences...')
    // Create Experiences
    const experiences = await Promise.all([
      prisma.experience.create({
        data: {
          userId: students[0].id,
          title: 'Software Engineering Intern',
          company: 'Google',
          location: 'Mountain View, CA',
          description: 'Developed internal tools and automation scripts using Python and Go',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-09-01'),
          current: false,
          skills: 'Python, Go, Automation, Testing'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[0].id,
          title: 'Research Assistant',
          company: 'Stanford AI Lab',
          location: 'Stanford, CA',
          description: 'Conducted research on neural network architectures under Dr. Foster',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2024-05-15'),
          current: false,
          skills: 'Machine Learning, Python, TensorFlow, Research'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[1].id,
          title: 'Hardware Engineer Intern',
          company: 'Intel',
          location: 'Hillsboro, OR',
          description: 'Designed and tested prototype circuit boards using VHDL and Verilog',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-05-30'),
          current: false,
          skills: 'VHDL, Verilog, Circuit Design, FPGA, Testing'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[0].id,
          title: 'Senior Software Engineer',
          company: 'Microsoft',
          location: 'Redmond, WA',
          description: 'Led development of cloud-based microservices architecture',
          startDate: new Date('2020-03-01'),
          endDate: null,
          current: true,
          skills: 'C#, .NET, Azure, Microservices, Leadership, Architecture'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[1].id,
          title: 'HR Manager',
          company: 'People First Consulting',
          location: 'Boston, MA',
          description: 'Managed HR operations for multiple client companies',
          startDate: new Date('2018-06-01'),
          endDate: new Date('2022-12-31'),
          current: false,
          skills: 'HR Management, Talent Acquisition, Recruiting, Onboarding'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[2].id,
          title: 'Product Manager',
          company: 'Amazon',
          location: 'Seattle, WA',
          description: 'Managed cross-functional team delivering enterprise software solutions',
          startDate: new Date('2019-08-01'),
          endDate: null,
          current: true,
          skills: 'Product Management, Agile, AWS, Leadership, Roadmapping'
        }
      }),
      prisma.experience.create({
        data: {
          userId: investors[0].id,
          title: 'Partner',
          company: 'Venture Fund Limited',
          location: 'New York, NY',
          description: 'Partner at venture capital firm focused on technology investments',
          startDate: new Date('2014-01-01'),
          endDate: null,
          current: true,
          skills: 'Venture Capital, Due Diligence, Deal Negotiation, Portfolio Management'
        }
      })
    ])

    console.log('✅ Created', experiences.length, 'experiences')

    console.log('🎓 Creating education records...')
    // Create Education
    const education = await Promise.all([
      prisma.education.create({
        data: {
          userId: students[0].id,
          school: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          description: 'Graduated with honors, focused on AI and machine learning',
          startDate: new Date('2020-09-01'),
          endDate: new Date('2024-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[0].id,
          school: 'Stanford University',
          degree: 'Master of Science',
          field: 'Artificial Intelligence',
          description: 'Thesis on transformer architectures for natural language processing',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2026-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[1].id,
          school: 'Massachusetts Institute of Technology',
          degree: 'Bachelor of Science',
          field: 'Electrical Engineering and Computer Science',
          description: 'Double major program with concentration in computer architecture',
          startDate: new Date('2018-09-01'),
          endDate: new Date('2024-06-01')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[2].id,
          school: 'University of California, Berkeley',
          degree: 'Master of Science',
          field: 'Data Science',
          description: 'Specialization in machine learning and statistical analysis',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2024-12-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[3].id,
          school: 'Carnegie Mellon University',
          degree: 'Bachelor of Science',
          field: 'Software Engineering',
          description: 'Minor in Human-Computer Interaction',
          startDate: new Date('2020-09-01'),
          endDate: new Date('2024-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[4].id,
          school: 'Georgia Institute of Technology',
          degree: 'Master of Industrial Design',
          field: 'Industrial Design',
          description: 'Focus on product design and user experience research',
          startDate: new Date('2021-09-01'),
          endDate: new Date('2023-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: employers[0].id,
          school: 'University of California, Berkeley',
          degree: 'Master of Business Administration',
          field: 'Technology Management',
          description: 'Executive MBA program with focus on digital transformation',
          startDate: new Date('2016-09-01'),
          endDate: new Date('2018-05-15')
        }
      })
    ])

    console.log('✅ Created', education.length, 'education records')

    console.log('📋 Creating projects...')
    // Create Projects
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'E-Commerce Platform',
          description: 'Full-stack e-commerce platform with advanced features including real-time inventory management, AI-powered product recommendations, and multi-vendor support',
          status: 'IN_PROGRESS',
          ownerId: employers[0].id,
          businessId: businesses[0].id,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          budget: 150000,
          category: 'Web Development'
        }
      }),
      prisma.project.create({
        data: {
          name: 'AI-Powered Analytics Dashboard',
          description: 'Enterprise analytics solution with machine learning models for predictive insights, real-time data visualization, and automated reporting capabilities',
          status: 'IN_PROGRESS',
          ownerId: employers[2].id,
          businessId: businesses[2].id,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-08-31'),
          budget: 200000,
          category: 'Data Science'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Mobile Banking App',
          description: 'Secure mobile banking application with biometric authentication, real-time fraud detection, and peer-to-peer payment capabilities',
          status: 'FUNDING',
          ownerId: employers[0].id,
          businessId: businesses[0].id,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-10-31'),
          budget: 300000,
          category: 'Mobile Development'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Smart Campus Management System',
          description: 'Comprehensive campus management platform for universities with features for course management, student tracking, and resource scheduling',
          status: 'IDEA',
          ownerId: universityAdmins[2].id,
          businessId: null,
          startDate: null,
          endDate: null,
          budget: 50000,
          category: 'Enterprise Software'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Research Collaboration Platform',
          description: 'Platform for facilitating research collaborations between universities, with tools for project tracking, document sharing, and milestone management',
          status: 'IDEA',
          ownerId: universityAdmins[0].id,
          businessId: null,
          startDate: null,
          endDate: null,
          budget: 75000,
          category: 'Research Tools'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Startup Website Development',
          description: 'Modern, responsive website development for early-stage startups with focus on SEO optimization and conversion rate improvement',
          status: 'COMPLETED',
          ownerId: employers[0].id,
          businessId: businesses[0].id,
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-01-31'),
          budget: 25000,
          category: 'Web Development'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Social Media Marketing Dashboard',
          description: 'Unified dashboard for managing multiple social media accounts with analytics, scheduling, and content management features',
          status: 'COMPLETED',
          ownerId: employers[1].id,
          businessId: businesses[1].id,
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-15'),
          budget: 30000,
          category: 'Marketing'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Inventory Management System',
          description: 'Cloud-based inventory management with barcode scanning, low stock alerts, and supplier integration',
          status: 'COMPLETED',
          ownerId: employers[2].id,
          businessId: businesses[2].id,
          startDate: new Date('2023-08-01'),
          endDate: new Date('2024-02-28'),
          budget: 40000,
          category: 'Enterprise Software'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Learning Management System',
          description: 'LMS platform with features for course creation, student enrollment, progress tracking, and automated assessments',
          status: 'ON_HOLD',
          ownerId: universityAdmins[1].id,
          businessId: null,
          startDate: new Date('2023-10-01'),
          endDate: new Date('2024-01-15'),
          budget: 100000,
          category: 'EdTech'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Event Registration Platform',
          description: 'Platform for managing campus events with ticket sales, attendee management, and event promotion tools',
          status: 'CANCELLED',
          ownerId: universityAdmins[0].id,
          businessId: null,
          startDate: new Date('2023-11-01'),
          endDate: new Date('2024-01-01'),
          budget: 60000,
          category: 'Web Development'
        }
      }),
      prisma.project.create({
        data: {
          name: 'Alumni Portal Redesign',
          description: 'Complete redesign of university alumni portal with improved UX, modern UI, and enhanced features',
          status: 'UNDER_REVIEW',
          ownerId: universityAdmins[1].id,
          businessId: null,
          startDate: new Date('2024-01-01'),
          endDate: null,
          budget: 35000,
          category: 'Web Development'
        }
      })
    ])

    console.log('✅ Created', projects.length, 'projects')

    // Add project members
    console.log('👥 Adding project members...')
    await Promise.all([
      prisma.projectMember.create({
        data: {
          projectId: projects[0].id,
          userId: students[0].id,
          role: 'PROJECT_MANAGER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[0].id,
          userId: students[1].id,
          role: 'TEAM_MEMBER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[0].id,
          userId: students[2].id,
          role: 'TEAM_LEAD'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[1].id,
          userId: students[2].id,
          role: 'PROJECT_MANAGER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[1].id,
          userId: students[3].id,
          role: 'TEAM_MEMBER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[2].id,
          userId: students[3].id,
          role: 'PROJECT_MANAGER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[3].id,
          userId: students[0].id,
          role: 'PROJECT_MANAGER'
        }
      }),
      prisma.projectMember.create({
        data: {
          projectId: projects[3].id,
          userId: students[1].id,
          role: 'TEAM_LEAD'
        }
      })
    ])

    console.log('✅ Created 9 project members')

    console.log('✅ Creating tasks...')
    // Create Tasks
    const taskData = [
      // Tasks for E-Commerce Platform
      {
        projectId: projects[0].id,
        title: 'Design Database Schema',
        description: 'Design and implement a scalable database schema for e-commerce platform supporting millions of products',
        status: 'DONE',
        priority: 'CRITICAL',
        assignedTo: students[0].id,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-02-15'),
        estimatedHours: 40,
        actualHours: 42.5
      },
      {
        projectId: projects[0].id,
        title: 'Implement User Authentication',
        description: 'Build JWT-based authentication system with OAuth integration for Google, Facebook, and GitHub',
        status: 'DONE',
        priority: 'CRITICAL',
        assignedTo: students[1].id,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-02-28'),
        estimatedHours: 56,
        actualHours: 58
      },
      {
        projectId: projects[0].id,
        title: 'Build Shopping Cart System',
        description: 'Create shopping cart with real-time sync, coupon support, and abandoned cart recovery',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: students[2].id,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-03-15'),
        estimatedHours: 64,
        actualHours: 32
      },
      {
        projectId: projects[0].id,
        title: 'Integrate Payment Gateway',
        description: 'Integrate Stripe and PayPal for secure payment processing with multi-currency support',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: students[0].id,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-03-20'),
        estimatedHours: 48,
        actualHours: 24
      },
      {
        projectId: projects[0].id,
        title: 'Implement Product Search',
        description: 'Build intelligent product search with Elasticsearch, filters, and autocomplete suggestions',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: null,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-04-01'),
        estimatedHours: 32,
        actualHours: null
      },
      {
        projectId: projects[0].id,
        title: 'Design Admin Dashboard',
        description: 'Create admin dashboard for managing products, orders, and analytics',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: null,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-04-15'),
        estimatedHours: 40,
        actualHours: null
      },
      {
        projectId: projects[0].id,
        title: 'Set Up CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing, building, and deployment',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: null,
        assignedBy: employers[0].id,
        dueDate: new Date('2024-04-10'),
        estimatedHours: 24,
        actualHours: null
      },
      // Tasks for AI-Powered Analytics Dashboard
      {
        projectId: projects[1].id,
        title: 'Design Data Models',
        description: 'Create comprehensive data models for analytics metrics, user behavior, and system events',
        status: 'DONE',
        priority: 'CRITICAL',
        assignedTo: students[2].id,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-02-20'),
        estimatedHours: 48,
        actualHours: 45
      },
      {
        projectId: projects[1].id,
        title: 'Implement ML Predictions',
        description: 'Build machine learning models for revenue prediction, churn analysis, and demand forecasting',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        assignedTo: students[2].id,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-03-15'),
        estimatedHours: 80,
        actualHours: 52
      },
      {
        projectId: projects[1].id,
        title: 'Create Data Visualization Components',
        description: 'Build interactive charts and graphs using D3.js for real-time data display',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: students[3].id,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-03-20'),
        estimatedHours: 56,
        actualHours: 38
      },
      {
        projectId: projects[1].id,
        title: 'Build REST API',
        description: 'Create RESTful API endpoints for data access with authentication and rate limiting',
        status: 'DONE',
        priority: 'HIGH',
        assignedTo: students[3].id,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-02-10'),
        estimatedHours: 36,
        actualHours: 34
      },
      {
        projectId: projects[1].id,
        title: 'Implement Real-time Updates',
        description: 'Add WebSocket support for real-time dashboard updates and notifications',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: null,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-03-25'),
        estimatedHours: 40,
        actualHours: null
      },
      {
        projectId: projects[1].id,
        title: 'Performance Optimization',
        description: 'Optimize database queries, implement caching, and improve API response times',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: null,
        assignedBy: employers[2].id,
        dueDate: new Date('2024-04-15'),
        estimatedHours: 32,
        actualHours: null
      }
    ]

    const tasks = await Promise.all(taskData.map(task => 
      prisma.task.create({ data: task })
    ))

    console.log('✅ Created', tasks.length, 'tasks')

    // Create SubTasks
    console.log('✅ Creating subtasks...')
    const subTasksData = [
      { taskId: tasks[0].id, title: 'Design tables and relationships', completed: true, sortOrder: 1 },
      { taskId: tasks[0].id, title: 'Create indexes for performance', completed: true, sortOrder: 2 },
      { taskId: tasks[0].id, title: 'Write migration scripts', completed: true, sortOrder: 3 },
      { taskId: tasks[1].id, title: 'Set up OAuth providers', completed: true, sortOrder: 1 },
      { taskId: tasks[1].id, title: 'Implement token refresh logic', completed: true, sortOrder: 2 },
      { taskId: tasks[1].id, title: 'Add social media login', completed: true, sortOrder: 3 },
      { taskId: tasks[1].id, title: 'Test authentication flows', completed: false, sortOrder: 4 },
      { taskId: tasks[2].id, title: 'Define schema fields', completed: true, sortOrder: 1 },
      { taskId: tasks[2].id, title: 'Create data validation layer', completed: true, sortOrder: 2 },
      { taskId: tasks[2].id, title: 'Train prediction models', completed: true, sortOrder: 3 },
      { taskId: tasks[2].id, title: 'Evaluate model accuracy', completed: true, sortOrder: 4 },
      { taskId: tasks[2].id, title: 'Create API endpoints', completed: true, sortOrder: 5 },
      { taskId: tasks[3].id, title: 'Research chart libraries', completed: true, sortOrder: 1 },
      { taskId: tasks[3].id, title: 'Implement main charts', completed: true, sortOrder: 2 },
      { taskId: tasks[3].id, title: 'Add interactivity features', completed: false, sortOrder: 3 },
      { taskId: tasks[3].id, title: 'Build API routes', completed: true, sortOrder: 4 },
      { taskId: tasks[3].id, title: 'Connect to data backend', completed: false, sortOrder: 5 }
    ]

    const subTasks = await Promise.all(subTasksData.map(st => 
      prisma.subTask.create({ data: st })
    ))

    console.log('✅ Created', subTasks.length, 'subtasks')

    // Create Task Dependencies
    console.log('🔗 Creating task dependencies...')
    await prisma.taskDependency.create({
      data: {
        taskId: tasks[4].id,
        dependsOnId: tasks[2].id
      }
    })
    await prisma.taskDependency.create({
      data: {
        taskId: tasks[4].id,
        dependsOnId: tasks[1].id
      }
    })
    await prisma.taskDependency.create({
      data: {
        taskId: tasks[4].id,
        dependsOnId: tasks[3].id
      }
    })

    console.log('✅ Created 3 task dependencies')

    // Create Milestones
    console.log('📊 Creating milestones...')
    const milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: projects[0].id,
          title: 'Phase 1 Complete',
          description: 'Complete database design and implementation',
          status: 'COMPLETED',
          dueDate: new Date('2024-02-28'),
          completedAt: new Date('2024-02-28'),
          metrics: 'All deliverables completed on time and within budget'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: projects[0].id,
          title: 'Phase 2 Complete',
          description: 'Complete user authentication and shopping cart features',
          status: 'IN_PROGRESS',
          dueDate: new Date('2024-03-31'),
          completedAt: null,
          metrics: 'Core features implemented, final testing in progress'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: projects[1].id,
          title: 'MVP Delivery',
          description: 'Deliver minimum viable product with core analytics features',
          status: 'COMPLETED',
          dueDate: new Date('2024-03-15'),
          completedAt: new Date('2024-03-15'),
          metrics: 'MVP delivered to beta testers with positive feedback'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: projects[1].id,
          title: 'Production Launch',
          description: 'Launch production version with all planned features',
          status: 'IN_PROGRESS',
          dueDate: new Date('2024-04-30'),
          completedAt: null,
          metrics: 'Preparing for launch with final integration testing'
        }
      })
    ])

    console.log('✅ Created', milestones.length, 'milestones')

    // Create Departments and Vacancies
    console.log('🏢 Creating departments and vacancies...')
    await Promise.all([
      prisma.department.create({
        data: {
          projectId: projects[0].id,
          name: 'Backend Development',
          headId: students[0].id
        }
      }),
      prisma.department.create({
        data: {
          projectId: projects[0].id,
          name: 'Frontend Development',
          headId: students[2].id
        }
      }),
      prisma.department.create({
        data: {
          projectId: projects[0].id,
          name: 'DevOps & Infrastructure',
          headId: null
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: projects[0].id,
          title: 'Senior Backend Engineer',
          description: 'Experienced backend engineer to work on e-commerce platform',
          type: 'FULL_TIME',
          skills: 'Node.js, TypeScript, PostgreSQL, AWS, Microservices',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: projects[0].id,
          title: 'Frontend Developer',
          description: 'Frontend developer to build modern React interfaces',
          type: 'FULL_TIME',
          skills: 'React, TypeScript, CSS, UI/UX, Responsive Design',
          slots: 1,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: projects[1].id,
          title: 'Data Scientist',
          description: 'Data scientist to build ML models for analytics dashboard',
          type: 'FULL_TIME',
          skills: 'Python, TensorFlow, PyTorch, Scikit-learn, SQL',
          slots: 3,
          filled: 2
        }
      })
    ])

    console.log('✅ Created departments and vacancies')

    console.log('💼 Creating job postings...')
    // Create Jobs
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'Senior Frontend Developer',
          description: 'Join our team to build next-generation e-commerce experiences. We are looking for an experienced Frontend Developer with strong React and TypeScript skills.',
          type: 'FULL_TIME',
          location: 'San Francisco, CA (Hybrid)',
          salary: '$140,000 - $180,000',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[1].id,
          businessId: businesses[1].id,
          title: 'HR Manager',
          description: 'Experienced HR Manager to join our growing consulting team. Responsibilities include talent acquisition, employee relations, and performance management.',
          type: 'FULL_TIME',
          location: 'Boston, MA (On-site)',
          salary: '$90,000 - $120,000',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[2].id,
          businessId: businesses[2].id,
          title: 'Product Manager',
          description: 'Product Manager to lead development of our flagship analytics platform. Experience with B2B SaaS products required.',
          type: 'FULL_TIME',
          location: 'Seattle, WA (Remote)',
          salary: '$130,000 - $160,000',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'Software Engineering Intern',
          description: 'Summer internship opportunity for students to work on real-world projects and gain industry experience.',
          type: 'INTERNSHIP',
          location: 'Remote',
          salary: '$25/hour',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'UI/UX Designer',
          description: 'Creative UI/UX Designer to create beautiful and intuitive user interfaces for our products.',
          type: 'CONTRACT',
          location: 'San Francisco, CA (On-site)',
          salary: '$80,000 - $100,000',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'DevOps Engineer',
          description: 'DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.',
          type: 'FULL_TIME',
          location: 'Remote',
          salary: '$120,000 - $150,000',
          published: true,
          publishedAt: yesterday
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[1].id,
          businessId: businesses[1].id,
          title: 'Business Analyst',
          description: 'Business Analyst to conduct market research and competitive analysis for our consulting clients.',
          type: 'PART_TIME',
          location: 'Boston, MA (Hybrid)',
          salary: '$40/hour',
          published: true,
          publishedAt: yesterday
        }
      })
    ])

    console.log('✅ Created', jobs.length, 'job postings')

    console.log('📝 Creating leave requests...')
    // Create Leave Requests
    const leaveRequests = await Promise.all([
      prisma.leaveRequest.create({
        data: {
          userId: students[0].id,
          leaveType: 'VACATION',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-15'),
          reason: 'Family vacation - spending time with parents before internship starts',
          status: 'APPROVED',
          rejectionReason: null,
          reviewedBy: employers[0].id,
          reviewedAt: yesterday
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[1].id,
          leaveType: 'SICK_LEAVE',
          startDate: yesterday,
          endDate: now,
          reason: 'Taking a sick day due to flu symptoms',
          status: 'APPROVED',
          rejectionReason: null,
          reviewedBy: employers[0].id,
          reviewedAt: now
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: employers[0].id,
          leaveType: 'PERSONAL_LEAVE',
          startDate: nextWeek,
          endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
          reason: 'Attending industry conference to network and explore partnerships',
          status: 'PENDING',
          rejectionReason: null,
          reviewedBy: null,
          reviewedAt: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[2].id,
          leaveType: 'EMERGENCY',
          startDate: yesterday,
          endDate: yesterday,
          reason: 'Family emergency - had to travel unexpectedly',
          status: 'APPROVED',
          rejectionReason: null,
          reviewedBy: universityAdmins[2].id,
          reviewedAt: yesterday
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[3].id,
          leaveType: 'MATERNITY',
          startDate: new Date('2024-04-15'),
          endDate: new Date('2024-05-30'),
          reason: 'Planned maternity leave for baby arrival',
          status: 'APPROVED',
          rejectionReason: null,
          reviewedBy: employers[1].id,
          reviewedAt: new Date('2024-03-01')
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[4].id,
          leaveType: 'BEREAVEMENT',
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          reason: 'Attending family funeral',
          status: 'APPROVED',
          rejectionReason: null,
          reviewedBy: universityAdmins[0].id,
          reviewedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[1].id,
          leaveType: 'PERSONAL_LEAVE',
          startDate: nextMonth,
          endDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
          reason: 'Taking time off to prepare for comprehensive exams',
          status: 'PENDING',
          rejectionReason: null,
          reviewedBy: null,
          reviewedAt: null
        }
      })
    ])

    console.log('✅ Created', leaveRequests.length, 'leave requests')

    console.log('⏱️ Creating work sessions and time entries...')
    // Create Work Sessions and Time Entries
    const workSessions = await Promise.all([
      prisma.workSession.create({
        data: {
          userId: students[0].id,
          startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 20 * 60 * 60 * 1000),
          duration: 14400 // 4 hours in seconds
        }
      }),
      prisma.workSession.create({
        data: {
          userId: students[1].id,
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          duration: 14400 // 4 hours in seconds
        }
      }),
      prisma.workSession.create({
        data: {
          userId: students[2].id,
          startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          duration: 14400 // 4 hours in seconds
        }
      }),
      prisma.workSession.create({
        data: {
          userId: employers[0].id,
          startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 20 * 60 * 60 * 1000),
          duration: 14400 // 4 hours in seconds
        }
      })
    ])

    // Create Time Entries
    const timeEntries = await Promise.all([
      prisma.timeEntry.create({
        data: {
          taskId: tasks[0].id,
          userId: students[0].id,
          date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          hours: 4,
          description: 'Database schema design and implementation',
          billable: true,
          hourlyRate: 75
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[1].id,
          userId: students[1].id,
          date: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          hours: 4.5,
          description: 'OAuth provider setup and configuration',
          billable: true,
          hourlyRate: 80
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[2].id,
          userId: students[2].id,
          date: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          hours: 6,
          description: 'Data model definition and validation',
          billable: true,
          hourlyRate: 85
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[3].id,
          userId: students[3].id,
          date: new Date(now.getTime() - 12 * 60 * 60 * 1000),
          hours: 3.5,
          description: 'Chart library selection and prototyping',
          billable: true,
          hourlyRate: 70
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[3].id,
          userId: students[3].id,
          date: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          hours: 5.5,
          description: 'REST API endpoint implementation',
          billable: true,
          hourlyRate: 75
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[1].id,
          userId: employers[0].id,
          date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          hours: 8,
          description: 'Project planning and team coordination',
          billable: true,
          hourlyRate: 100
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: tasks[4].id,
          userId: employers[0].id,
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          hours: 40,
          description: 'Overall project management and oversight',
          billable: false,
          hourlyRate: null
        }
      })
    ])

    console.log('✅ Created', workSessions.length, 'work sessions')
    console.log('✅ Created', timeEntries.length, 'time entries')

    console.log('💰 Creating investments...')
    // Create Investments
    const investments = await Promise.all([
      prisma.investment.create({
        data: {
          projectId: projects[2].id,
          userId: investors[0].id,
          amount: 500000,
          type: 'SERIES_A',
          status: 'ACTIVE'
        }
      }),
      prisma.investment.create({
        data: {
          projectId: projects[2].id,
          userId: investors[1].id,
          amount: 250000,
          type: 'SERIES_A',
          status: 'ACTIVE'
        }
      }),
      prisma.investment.create({
        data: {
          projectId: projects[2].id,
          userId: investors[2].id,
          amount: 100000,
          type: 'SERIES_A',
          status: 'PENDING'
        }
      }),
      prisma.investment.create({
        data: {
          projectId: projects[2].id,
          userId: investors[0].id,
          amount: 750000,
          type: 'SERIES_B',
          status: 'ACTIVE'
        }
      })
    ])

    console.log('✅ Created', investments.length, 'investments')

    console.log('💬 Creating notifications...')
    // Create Notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: students[0].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Design Database Schema',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[0].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Implement User Authentication',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[1].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Design Data Models',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[2].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Create Data Visualization Components',
          priority: 'MEDIUM'
        }
      }),
      prisma.notification.create({
        data: {
          userId: employers[0].id,
          type: 'PROJECT_UPDATE',
          title: 'Project Milestone Reached',
          message: 'E-Commerce Platform has completed Phase 1',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: employers[2].id,
          type: 'PROJECT_UPDATE',
          title: 'Project Milestone Reached',
          message: 'Analytics Dashboard MVP has been delivered successfully',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[1].id,
          type: 'VERIFICATION',
          title: 'Leave Request Approved',
          message: 'Your sick leave request has been approved',
          priority: 'URGENT'
        }
      }),
      prisma.notification.create({
        data: {
          userId: investors[0].id,
          type: 'INVESTMENT',
          title: 'New Investment Opportunity',
          message: 'AI-Powered Analytics Dashboard is seeking Series A funding. Review details in your dashboard.',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[3].id,
          type: 'INFO',
          title: 'Course Enrollment Open',
          message: 'Registration for Summer courses is now open. Enroll before April 15 to secure your spot.',
          priority: 'MEDIUM'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[4].id,
          type: 'SUCCESS',
          title: 'Milestone Achieved',
          message: 'Congratulations! You have earned the "Design Excellence" badge for your project contributions.',
          priority: 'MEDIUM'
        }
      })
    ])

    console.log('✅ Created', notifications.length, 'notifications')

    console.log('📊 Creating ratings...')
    // Create Ratings
    const ratings = await Promise.all([
      prisma.rating.create({
        data: {
          fromUserId: students[0].id,
          toUserId: students[1].id,
          type: 'COLLABORATION',
          score: 5,
          comment: 'Excellent collaborator on database project. Great communication skills and always willing to help.',
          projectId: projects[0].id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[1].id,
          toUserId: students[0].id,
          type: 'EXECUTION',
          score: 5,
          comment: 'Delivered high-quality authentication implementation ahead of schedule. Very detail-oriented code.',
          projectId: projects[0].id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[2].id,
          toUserId: students[3].id,
          type: 'LEADERSHIP',
          score: 4,
          comment: 'Great team leadership on visualization tasks. Kept everyone focused and motivated.',
          projectId: projects[1].id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: employers[0].id,
          toUserId: students[0].id,
          type: 'EXECUTION',
          score: 5,
          comment: 'Outstanding work on database schema. Exceeded expectations in quality and timeline.',
          projectId: projects[0].id
        }
      })
    ])

    console.log('✅ Created', ratings.length, 'ratings')

    console.log('📋 Creating audit logs...')
    // Create Audit Logs
    const auditLogs = await Promise.all([
      prisma.auditLog.create({
        data: {
          userId: students[0].id,
          action: 'CREATE',
          entity: 'Task',
          entityId: tasks[0].id,
          details: 'Created task: Design Database Schema'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[0].id,
          action: 'UPDATE',
          entity: 'Task',
          entityId: tasks[2].id,
          details: 'Updated task status to DONE for: Implement User Authentication'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[0].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: projects[0].id,
          details: 'Created project: E-Commerce Platform'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: employers[0].id,
          action: 'CREATE',
          entity: 'Job',
          entityId: jobs[0].id,
          details: 'Created job posting: Senior Frontend Developer'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: employers[1].id,
          action: 'LOGIN',
          entity: 'User',
          entityId: employers[1].id,
          details: 'User logged in from IP: 192.168.1.100'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: investors[0].id,
          action: 'CREATE',
          entity: 'Investment',
          entityId: investments[0].id,
          details: 'Created investment of $500,000 in AI-Powered Analytics Dashboard'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: universityAdmins[0].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: projects[3].id,
          details: 'Created project idea: Research Collaboration Platform'
        }
      })
    ])

    console.log('✅ Created', auditLogs.length, 'audit logs')

    console.log('✨ Database seeding completed successfully!')
    console.log('\n' + '='.repeat(50))
    console.log('📋 LOGIN CREDENTIALS:')
    console.log('='.repeat(50))
    console.log('')
    console.log('STUDENTS:')
    console.log('  Email: student.stanford@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Alex Johnson')
    console.log('  Role: STUDENT')
    console.log('  University: Stanford University')
    console.log('')
    console.log('  Email: student.mit@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Emily Chen')
    console.log('  Role: STUDENT')
    console.log('  University: MIT')
    console.log('')
    console.log('  Email: student.berkeley@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Marcus Williams')
    console.log('  Role: STUDENT')
    console.log('  University: UC Berkeley')
    console.log('')
    console.log('  Email: student.cmu@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Sophia Rodriguez')
    console.log('  Role: STUDENT')
    console.log('  University: CMU')
    console.log('')
    console.log('  Email: student.gt@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: James Park')
    console.log('  Role: STUDENT')
    console.log('  University: Georgia Tech')
    console.log('')
    console.log('EMPLOYERS:')
    console.log('  Email: employer@techcorp.com')
    console.log('  Password: Password123!')
    console.log('  Name: Michael Thompson')
    console.log('  Role: EMPLOYER')
    console.log('  Company: TechCorp Solutions')
    console.log('')
    console.log('  Email: hr@innovatech.com')
    console.log('  Password: Password123!')
    console.log('  Name: Sarah Martinez')
    console.log('  Role: EMPLOYER')
    console.log('  Company: InnovateCH Inc.')
    console.log('')
    console.log('  Email: manager@startuphub.com')
    console.log('  Password: Password123!')
    console.log('  Name: David Kim')
    console.log('  Role: EMPLOYER')
    console.log('  Company: StartupHub')
    console.log('')
    console.log('INVESTORS:')
    console.log('  Email: investor@venturefund.com')
    console.log('  Password: Password123!')
    console.log('  Name: Richard Anderson')
    console.log('  Role: INVESTOR')
    console.log('  Company: Venture Fund Limited')
    console.log('')
    console.log('  Email: angel@seedfund.com')
    console.log('  Password: Password123!')
    console.log('  Name: Jennifer Lee')
    console.log('  Role: INVESTOR')
    console.log('  Company: Seed Fund')
    console.log('')
    console.log('  Email: partner@growthcapital.com')
    console.log('  Password: Password123!')
    console.log('  Name: Robert Chen')
    console.log('  Role: INVESTOR')
    console.log('  Company: Growth Capital')
    console.log('')
    console.log('UNIVERSITY ADMINS:')
    console.log('  Email: admin.stanford@stanford.edu')
    console.log('  Password: Password123!')
    console.log('  Name: Dr. William Foster')
    console.log('  Role: UNIVERSITY_ADMIN')
    console.log('  University: Stanford University')
    console.log('')
    console.log('  Email: admin.mit@mit.edu')
    console.log('  Password: Password123!')
    console.log('  Name: Dr. Patricia Moore')
    console.log('  Role: UNIVERSITY_ADMIN')
    console.log('  University: MIT')
    console.log('')
    console.log('  Email: admin.berkeley@berkeley.edu')
    console.log('  Password: Password123!')
    console.log('  Name: Prof. James Wilson')
    console.log('  Role: UNIVERSITY_ADMIN')
    console.log('  University: UC Berkeley')
    console.log('')
    console.log('PLATFORM ADMIN:')
    console.log('  Email: admin@careertodo.com')
    console.log('  Password: Password123!')
    console.log('  Name: System Administrator')
    console.log('  Role: PLATFORM_ADMIN')
    console.log('')
    console.log('='.repeat(50))
    console.log('')
    console.log('📊 SUMMARY OF SEEDED DATA:')
    console.log('='.repeat(50))
    console.log('')
    console.log('Universities:', universities.length)
    console.log('Users:', students.length + employers.length + investors.length + universityAdmins.length + 1)
    console.log('Businesses:', businesses.length)
    console.log('Business Members:', 6)
    console.log('Skills:', skills.length)
    console.log('Experiences:', experiences.length)
    console.log('Education:', education.length)
    console.log('Projects:', projects.length)
    console.log('Project Members:', 9)
    console.log('Tasks:', tasks.length)
    console.log('SubTasks:', subTasks.length)
    console.log('Task Dependencies:', 3)
    console.log('Milestones:', milestones.length)
    console.log('Departments:', 4)
    console.log('Vacancies:', 4)
    console.log('Jobs:', jobs.length)
    console.log('Leave Requests:', leaveRequests.length)
    console.log('Work Sessions:', workSessions.length)
    console.log('Time Entries:', timeEntries.length)
    console.log('Investments:', investments.length)
    console.log('Notifications:', notifications.length)
    console.log('Ratings:', ratings.length)
    console.log('Audit Logs:', auditLogs.length)
    console.log('')
    console.log('✅ All data seeded successfully!')

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
