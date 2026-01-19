import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================
// COMPREHENSIVE DEMO DATA - 20 RECORDS EACH
// ============================================

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // Clean up existing data
  await prisma.message.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.workSession.deleteMany()
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.subTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.department.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.professionalRecord.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.agreement.deleteMany()
  await prisma.project.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.leaderboard.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.verificationRequest.deleteMany()
  await prisma.user.deleteMany()
  await prisma.university.deleteMany()

  console.log('✅ Cleared existing data')

  // ==================== 20 UNIVERSITIES ====================
  const universitiesData = [
    { name: 'Stanford University', code: 'STAN', description: 'Leading research university in Silicon Valley', location: 'Stanford, CA', rankingScore: 98.5, rankingPosition: 3, totalStudents: 17000 },
    { name: 'MIT', code: 'MIT', description: 'Massachusetts Institute of Technology', location: 'Cambridge, MA', rankingScore: 99.2, rankingPosition: 1, totalStudents: 11500 },
    { name: 'Harvard University', code: 'HARV', description: 'Ivy League research university', location: 'Cambridge, MA', rankingScore: 98.8, rankingPosition: 2, totalStudents: 23000 },
    { name: 'UC Berkeley', code: 'UCB', description: 'University of California, Berkeley', location: 'Berkeley, CA', rankingScore: 96.5, rankingPosition: 8, totalStudents: 45000 },
    { name: 'Carnegie Mellon', code: 'CMU', description: 'Top computer science and engineering school', location: 'Pittsburgh, PA', rankingScore: 97.2, rankingPosition: 5, totalStudents: 14000 },
    { name: 'Georgia Tech', code: 'GATECH', description: 'Georgia Institute of Technology', location: 'Atlanta, GA', rankingScore: 95.8, rankingPosition: 12, totalStudents: 36000 },
    { name: 'University of Washington', code: 'UW', description: 'Public research university in Seattle', location: 'Seattle, WA', rankingScore: 94.5, rankingPosition: 18, totalStudents: 48000 },
    { name: 'University of Texas at Austin', code: 'UT', description: 'Flagship university of Texas', location: 'Austin, TX', rankingScore: 95.2, rankingPosition: 15, totalStudents: 52000 },
    { name: 'University of Michigan', code: 'UMICH', description: 'Top public university in Midwest', location: 'Ann Arbor, MI', rankingScore: 96.0, rankingPosition: 10, totalStudents: 47000 },
    { name: 'Northwestern University', code: 'NU', description: 'Private research university near Chicago', location: 'Evanston, IL', rankingScore: 95.5, rankingPosition: 13, totalStudents: 22000 },
    { name: 'University of Pennsylvania', code: 'UPENN', description: 'Ivy League university in Philadelphia', location: 'Philadelphia, PA', rankingScore: 97.0, rankingPosition: 6, totalStudents: 26000 },
    { name: 'Columbia University', code: 'COL', description: 'Ivy League university in NYC', location: 'New York, NY', rankingScore: 96.8, rankingPosition: 9, totalStudents: 33000 },
    { name: 'Duke University', code: 'DUKE', description: 'Top private research university', location: 'Durham, NC', rankingScore: 96.2, rankingPosition: 11, totalStudents: 16000 },
    { name: 'University of Chicago', code: 'UChicago', description: 'Leading university in economics and sciences', location: 'Chicago, IL', rankingScore: 97.5, rankingPosition: 4, totalStudents: 18000 },
    { name: 'Caltech', code: 'CALTECH', description: 'California Institute of Technology', location: 'Pasadena, CA', rankingScore: 98.0, rankingPosition: 7, totalStudents: 2400 },
    { name: 'University of Illinois Urbana-Champaign', code: 'UIUC', description: 'Top engineering and computer science', location: 'Urbana, IL', rankingScore: 94.0, rankingPosition: 20, totalStudents: 52000 },
    { name: 'Cornell University', code: 'CORNELL', description: 'Ivy League university in upstate New York', location: 'Ithaca, NY', rankingScore: 95.0, rankingPosition: 14, totalStudents: 25000 },
    { name: 'Johns Hopkins University', code: 'JHU', description: 'Leading medical and research university', location: 'Baltimore, MD', rankingScore: 96.5, rankingPosition: 8, totalStudents: 26000 },
    { name: 'University of Southern California', code: 'USC', description: 'Private research university in Los Angeles', location: 'Los Angeles, CA', rankingScore: 94.8, rankingPosition: 17, totalStudents: 47000 },
    { name: 'Purdue University', code: 'PURDUE', description: 'Flagship university of Indiana', location: 'West Lafayette, IN', rankingScore: 94.5, rankingPosition: 19, totalStudents: 45000 },
  ]

  const universities = await Promise.all(
    universitiesData.map(u => prisma.university.create({ data: { ...u, verificationStatus: 'VERIFIED', totalProjects: 0 } }))
  )
  console.log(`✅ Created ${universities.length} universities`)

  // ==================== 80 USERS (20 each role) ====================

  // 20 STUDENTS
  const studentsData = [
    { email: 'student1@demo.edu', name: 'Emily Chen', role: 'STUDENT', universityId: universities[0].id, major: 'Computer Science', graduationYear: 2025, bio: 'Passionate about AI and machine learning', location: 'San Francisco, CA', linkedinUrl: 'linkedin.com/in/emilychen', portfolioUrl: 'portfolio.emilychen.dev' },
    { email: 'student2@demo.edu', name: 'James Wilson', role: 'STUDENT', universityId: universities[1].id, major: 'Electrical Engineering', graduationYear: 2024, bio: 'Robotics enthusiast', location: 'Boston, MA', linkedinUrl: 'linkedin.com/in/jameswilson' },
    { email: 'student3@demo.edu', name: 'Sarah Johnson', role: 'STUDENT', universityId: universities[2].id, major: 'Business Administration', graduationYear: 2026, bio: 'Aspiring entrepreneur', location: 'Cambridge, MA', portfolioUrl: 'sarahj.co' },
    { email: 'student4@demo.edu', name: 'Michael Brown', role: 'STUDENT', universityId: universities[3].id, major: 'Data Science', graduationYear: 2025, bio: 'Big data and analytics specialist', location: 'Berkeley, CA' },
    { email: 'student5@demo.edu', name: 'Lisa Anderson', role: 'STUDENT', universityId: universities[4].id, major: 'Computer Science', graduationYear: 2024, bio: 'Full-stack developer', location: 'Pittsburgh, PA' },
    { email: 'student6@demo.edu', name: 'David Lee', role: 'STUDENT', universityId: universities[5].id, major: 'Industrial Engineering', graduationYear: 2025, bio: 'Manufacturing automation expert', location: 'Atlanta, GA' },
    { email: 'student7@demo.edu', name: 'Emma Rodriguez', role: 'STUDENT', universityId: universities[6].id, major: 'Computer Science', graduationYear: 2026, bio: 'Cloud computing researcher', location: 'Seattle, WA' },
    { email: 'student8@demo.edu', name: 'Chris Taylor', role: 'STUDENT', universityId: universities[7].id, major: 'Mechanical Engineering', graduationYear: 2025, bio: 'Automotive systems designer', location: 'Austin, TX' },
    { email: 'student9@demo.edu', name: 'Amanda White', role: 'STUDENT', universityId: universities[8].id, major: 'Psychology', graduationYear: 2024, bio: 'UX researcher', location: 'Ann Arbor, MI' },
    { email: 'student10@demo.edu', name: 'Ryan Martinez', role: 'STUDENT', universityId: universities[9].id, major: 'Economics', graduationYear: 2026, bio: 'Financial modeling enthusiast', location: 'Evanston, IL' },
    { email: 'student11@demo.edu', name: 'Sophie Kim', role: 'STUDENT', universityId: universities[10].id, major: 'Bioengineering', graduationYear: 2025, bio: 'Biotech startup founder', location: 'Philadelphia, PA' },
    { email: 'student12@demo.edu', name: 'Kevin Nguyen', role: 'STUDENT', universityId: universities[11].id, major: 'Computer Science', graduationYear: 2024, bio: 'Frontend developer', location: 'New York, NY', portfolioUrl: 'kevindev.io' },
    { email: 'student13@demo.edu', name: 'Jessica Parker', role: 'STUDENT', universityId: universities[12].id, major: 'Marketing', graduationYear: 2026, bio: 'Digital marketing specialist', location: 'Durham, NC' },
    { email: 'student14@demo.edu', name: 'Brandon Scott', role: 'STUDENT', universityId: universities[13].id, major: 'Philosophy', graduationYear: 2025, bio: 'Ethics in AI researcher', location: 'Chicago, IL' },
    { email: 'student15@demo.edu', name: 'Mia Thompson', role: 'STUDENT', universityId: universities[14].id, major: 'Physics', graduationYear: 2026, bio: 'Quantum computing enthusiast', location: 'Pasadena, CA' },
    { email: 'student16@demo.edu', name: 'Alex Turner', role: 'STUDENT', universityId: universities[15].id, major: 'Computer Engineering', graduationYear: 2025, bio: 'Hardware security researcher', location: 'Urbana, IL' },
    { email: 'student17@demo.edu', name: 'Nicole Green', role: 'STUDENT', universityId: universities[16].id, major: 'Hospitality Management', graduationYear: 2024, bio: 'Event coordinator', location: 'Ithaca, NY' },
    { email: 'student18@demo.edu', name: 'Tyler Adams', role: 'STUDENT', universityId: universities[17].id, major: 'Biomedical Engineering', graduationYear: 2025, bio: 'Medical device innovator', location: 'Baltimore, MD' },
    { email: 'student19@demo.edu', name: 'Hannah Lee', role: 'STUDENT', universityId: universities[18].id, major: 'Cinematic Arts', graduationYear: 2026, bio: 'Film director and producer', location: 'Los Angeles, CA' },
    { email: 'student20@demo.edu', name: 'Jake Miller', role: 'STUDENT', universityId: universities[19].id, major: 'Aerospace Engineering', graduationYear: 2025, bio: 'Rocket propulsion researcher', location: 'West Lafayette, IN' },
  ]

  const students = await Promise.all(
    studentsData.map(s => prisma.user.create({ data: { ...s, verificationStatus: 'VERIFIED', emailVerified: true } }))
  )
  console.log(`✅ Created ${students.length} students`)

  // 20 UNIVERSITY ADMINS
  const uniAdminsData = [
    { email: 'admin1@stanford.edu', name: 'Dr. Robert Martinez', role: 'UNIVERSITY_ADMIN', universityId: universities[0].id, bio: 'Professor of Computer Science', position: 'Dean of Engineering', location: 'Stanford, CA' },
    { email: 'admin2@mit.edu', name: 'Dr. Sarah Williams', role: 'UNIVERSITY_ADMIN', universityId: universities[1].id, bio: 'Professor of Electrical Engineering', position: 'Department Head', location: 'Cambridge, MA' },
    { email: 'admin3@harvard.edu', name: 'Dr. Michael Johnson', role: 'UNIVERSITY_ADMIN', universityId: universities[2].id, bio: 'Professor of Business', position: 'Associate Dean', location: 'Cambridge, MA' },
    { email: 'admin4@berkeley.edu', name: 'Dr. Emily Davis', role: 'UNIVERSITY_ADMIN', universityId: universities[3].id, bio: 'Professor of Data Science', position: 'Program Director', location: 'Berkeley, CA' },
    { email: 'admin5@cmu.edu', name: 'Dr. James Brown', role: 'UNIVERSITY_ADMIN', universityId: universities[4].id, bio: 'Professor of Robotics', position: 'Research Director', location: 'Pittsburgh, PA' },
    { email: 'admin6@gatech.edu', name: 'Dr. Linda Wilson', role: 'UNIVERSITY_ADMIN', universityId: universities[5].id, bio: 'Professor of Industrial Engineering', position: 'Department Chair', location: 'Atlanta, GA' },
    { email: 'admin7@washington.edu', name: 'Dr. Kevin Anderson', role: 'UNIVERSITY_ADMIN', universityId: universities[6].id, bio: 'Professor of Computer Science', position: 'Associate Dean', location: 'Seattle, WA' },
    { email: 'admin8@utexas.edu', name: 'Dr. Rachel Taylor', role: 'UNIVERSITY_ADMIN', universityId: universities[7].id, bio: 'Professor of Mechanical Engineering', position: 'Program Coordinator', location: 'Austin, TX' },
    { email: 'admin9@umich.edu', name: 'Dr. David Martinez', role: 'UNIVERSITY_ADMIN', universityId: universities[8].id, bio: 'Professor of Psychology', position: 'Department Head', location: 'Ann Arbor, MI' },
    { email: 'admin10@northwestern.edu', name: 'Dr. Jennifer Lee', role: 'UNIVERSITY_ADMIN', universityId: universities[9].id, bio: 'Professor of Economics', position: 'Associate Dean', location: 'Evanston, IL' },
    { email: 'admin11@upenn.edu', name: 'Dr. Robert Chen', role: 'UNIVERSITY_ADMIN', universityId: universities[10].id, bio: 'Professor of Bioengineering', position: 'Research Director', location: 'Philadelphia, PA' },
    { email: 'admin12@columbia.edu', name: 'Dr. Sarah Wilson', role: 'UNIVERSITY_ADMIN', universityId: universities[11].id, bio: 'Professor of Computer Science', position: 'Department Chair', location: 'New York, NY' },
    { email: 'admin13@duke.edu', name: 'Dr. Michael Brown', role: 'UNIVERSITY_ADMIN', universityId: universities[12].id, bio: 'Professor of Marketing', position: 'Program Director', location: 'Durham, NC' },
    { email: 'admin14@uchicago.edu', name: 'Dr. Emily Rodriguez', role: 'UNIVERSITY_ADMIN', universityId: universities[13].id, bio: 'Professor of Philosophy', position: 'Department Head', location: 'Chicago, IL' },
    { email: 'admin15@caltech.edu', name: 'Dr. James Anderson', role: 'UNIVERSITY_ADMIN', universityId: universities[14].id, bio: 'Professor of Physics', position: 'Associate Dean', location: 'Pasadena, CA' },
    { email: 'admin16@uiuc.edu', name: 'Dr. Linda Taylor', role: 'UNIVERSITY_ADMIN', universityId: universities[15].id, bio: 'Professor of Computer Engineering', position: 'Department Chair', location: 'Urbana, IL' },
    { email: 'admin17@cornell.edu', name: 'Dr. Kevin Martinez', role: 'UNIVERSITY_ADMIN', universityId: universities[16].id, bio: 'Professor of Hospitality', position: 'Program Director', location: 'Ithaca, NY' },
    { email: 'admin18@jhu.edu', name: 'Dr. Rachel Chen', role: 'UNIVERSITY_ADMIN', universityId: universities[17].id, bio: 'Professor of Biomedical Engineering', position: 'Research Director', location: 'Baltimore, MD' },
    { email: 'admin19@usc.edu', name: 'Dr. David Wilson', role: 'UNIVERSITY_ADMIN', universityId: universities[18].id, bio: 'Professor of Cinematic Arts', position: 'Department Chair', location: 'Los Angeles, CA' },
    { email: 'admin20@purdue.edu', name: 'Dr. Emily Brown', role: 'UNIVERSITY_ADMIN', universityId: universities[19].id, bio: 'Professor of Aerospace Engineering', position: 'Associate Dean', location: 'West Lafayette, IN' },
  ]

  const uniAdmins = await Promise.all(
    uniAdminsData.map(a => prisma.user.create({ data: { ...a, verificationStatus: 'VERIFIED', emailVerified: true } }))
  )
  console.log(`✅ Created ${uniAdmins.length} university admins`)

  // 20 EMPLOYERS
  const employersData = [
    { email: 'employer1@company.com', name: 'John Smith', role: 'EMPLOYER', companyName: 'TechCorp Inc.', position: 'CTO', companyWebsite: 'techcorp.com', bio: 'Technology company focused on AI solutions', location: 'San Francisco, CA' },
    { email: 'employer2@company.com', name: 'Mary Johnson', role: 'EMPLOYER', companyName: 'DataFlow Systems', position: 'VP of Engineering', companyWebsite: 'dataflow.io', bio: 'Data infrastructure provider', location: 'Austin, TX' },
    { email: 'employer3@company.com', name: 'Robert Chen', role: 'EMPLOYER', companyName: 'StartupX', position: 'CEO', companyWebsite: 'startupx.com', bio: 'Startup accelerator and VC firm', location: 'New York, NY' },
    { email: 'employer4@company.com', name: 'Sarah Wilson', role: 'EMPLOYER', companyName: 'CloudNine Solutions', position: 'Founder', companyWebsite: 'cloudnine.dev', bio: 'Cloud services company', location: 'Seattle, WA' },
    { email: 'employer5@company.com', name: 'Michael Brown', role: 'EMPLOYER', companyName: 'AI Dynamics', position: 'VP of Products', companyWebsite: 'aidynamics.ai', bio: 'AI-powered business solutions', location: 'Cambridge, MA' },
    { email: 'employer6@company.com', name: 'Emily Davis', role: 'EMPLOYER', companyName: 'GreenTech Labs', position: 'CTO', companyWebsite: 'greentech.io', bio: 'Sustainable technology solutions', location: 'Berkeley, CA' },
    { email: 'employer7@company.com', name: 'David Lee', role: 'EMPLOYER', companyName: 'FinTech Pro', position: 'Managing Director', companyWebsite: 'fintechpro.com', bio: 'Financial technology platform', location: 'Chicago, IL' },
    { email: 'employer8@company.com', name: 'Lisa Anderson', role: 'EMPLOYER', companyName: 'HealthFlow', position: 'Founder', companyWebsite: 'healthflow.io', bio: 'Healthcare workflow automation', location: 'Boston, MA' },
    { email: 'employer9@company.com', name: 'Chris Taylor', role: 'EMPLOYER', companyName: 'RetailMax', position: 'VP of Technology', companyWebsite: 'retailmax.com', bio: 'E-commerce platform', location: 'Los Angeles, CA' },
    { email: 'employer10@company.com', name: 'Amanda White', role: 'EMPLOYER', companyName: 'MediaHub', position: 'Creative Director', companyWebsite: 'mediahub.tv', bio: 'Media production company', location: 'New York, NY' },
    { email: 'employer11@company.com', name: 'Ryan Martinez', role: 'EMPLOYER', companyName: 'LogiTech', position: 'CEO', companyWebsite: 'logitech.io', bio: 'Logistics and supply chain software', location: 'Chicago, IL' },
    { email: 'employer12@company.com', name: 'Sophie Kim', role: 'EMPLOYER', companyName: 'EduLearn', position: 'Head of Product', companyWebsite: 'edulearn.edu', bio: 'Educational technology platform', location: 'Philadelphia, PA' },
    { email: 'employer13@company.com', name: 'Kevin Nguyen', role: 'EMPLOYER', companyName: 'AutoDrive', position: 'CTO', companyWebsite: 'autodrive.ai', bio: 'Autonomous vehicle research', location: 'Detroit, MI' },
    { email: 'employer14@company.com', name: 'Jessica Parker', role: 'EMPLOYER', companyName: 'BioGen', position: 'VP of R&D', companyWebsite: 'biogen.bio', bio: 'Biotechnology research', location: 'Boston, MA' },
    { email: 'employer15@company.com', name: 'Brandon Scott', role: 'EMPLOYER', companyName: 'CyberShield', position: 'Founder', companyWebsite: 'cybershield.com', bio: 'Cybersecurity solutions', location: 'Washington, DC' },
    { email: 'employer16@company.com', name: 'Mia Thompson', role: 'EMPLOYER', companyName: 'EnergyFirst', position: 'VP of Engineering', companyWebsite: 'energyfirst.io', bio: 'Renewable energy solutions', location: 'Denver, CO' },
    { email: 'employer17@company.com', name: 'Alex Turner', role: 'EMPLOYER', companyName: 'RetailNext', position: 'CEO', companyWebsite: 'retailnext.com', bio: 'Next-gen retail technology', location: 'Seattle, WA' },
    { email: 'employer18@company.com', name: 'Nicole Green', role: 'EMPLOYER', companyName: 'FoodTech Co', position: 'CTO', companyWebsite: 'foodtech.io', bio: 'Food technology startup', location: 'San Francisco, CA' },
    { email: 'employer19@company.com', name: 'Tyler Adams', role: 'EMPLOYER', companyName: 'PropTech', position: 'Founder', companyWebsite: 'proptech.io', bio: 'Property technology platform', location: 'Miami, FL' },
    { email: 'employer20@company.com', name: 'Hannah Lee', role: 'EMPLOYER', companyName: 'CleanEnergy', position: 'VP of Operations', companyWebsite: 'cleanenergy.io', bio: 'Clean energy solutions', location: 'Austin, TX' },
  ]

  const employers = await Promise.all(
    employersData.map(e => prisma.user.create({ data: { ...e, verificationStatus: 'VERIFIED', emailVerified: true } }))
  )
  console.log(`✅ Created ${employers.length} employers`)

  // 20 INVESTORS
  const investorsData = [
    { email: 'investor1@vc.com', name: 'Mark Thompson', role: 'INVESTOR', firmName: 'Venture Capital Partners', investmentFocus: 'AI, ML, DeepTech', bio: 'Early-stage technology investor', location: 'San Francisco, CA' },
    { email: 'investor2@vc.com', name: 'Sarah Chen', role: 'INVESTOR', firmName: 'Sequoia Growth', investmentFocus: 'Consumer, B2B', bio: 'Growth stage investor', location: 'Menlo Park, CA' },
    { email: 'investor3@vc.com', name: 'Michael Wilson', role: 'INVESTOR', firmName: 'Horizon Ventures', investmentFocus: 'Healthcare, Biotech', bio: 'Healthcare technology investor', location: 'Boston, MA' },
    { email: 'investor4@vc.com', name: 'Emily Rodriguez', role: 'INVESTOR', firmName: 'Blue Shift Capital', investmentFocus: 'CleanTech, Energy', bio: 'Clean technology investor', location: 'New York, NY' },
    { email: 'investor5@vc.com', name: 'David Lee', role: 'INVESTOR', firmName: 'Quantum Fund', investmentFocus: 'DeepTech, Quantum', bio: 'Deep technology investor', location: 'Austin, TX' },
    { email: 'investor6@vc.com', name: 'Lisa Anderson', role: 'INVESTOR', firmName: 'Green Horizon', investmentFocus: 'Sustainability, GreenTech', bio: 'Impact investing', location: 'Seattle, WA' },
    { email: 'investor7@vc.com', name: 'Chris Taylor', role: 'INVESTOR', firmName: 'Alpha Ventures', investmentFocus: 'SaaS, Cloud', bio: 'Software as a service investor', location: 'Chicago, IL' },
    { email: 'investor8@vc.com', name: 'Amanda White', role: 'INVESTOR', firmName: 'NextGen Fund', investmentFocus: 'FinTech, Blockchain', bio: 'Financial technology investor', location: 'Miami, FL' },
    { email: 'investor9@vc.com', name: 'Ryan Martinez', role: 'INVESTOR', firmName: 'Peak Capital', investmentFocus: 'E-commerce, Retail', bio: 'E-commerce investor', location: 'Los Angeles, CA' },
    { email: 'investor10@vc.com', name: 'Sophie Kim', role: 'INVESTOR', firmName: 'ScaleUp Ventures', investmentFocus: 'B2B, Enterprise', bio: 'B2B enterprise investor', location: 'New York, NY' },
    { email: 'investor11@vc.com', name: 'Kevin Nguyen', role: 'INVESTOR', firmName: 'Future Fund', investmentFocus: 'AI, Robotics', bio: 'AI and robotics investor', location: 'San Francisco, CA' },
    { email: 'investor12@vc.com', name: 'Jessica Parker', role: 'INVESTOR', firmName: 'Impact Investors', investmentFocus: 'Social Impact', bio: 'Social impact investing', location: 'Boston, MA' },
    { email: 'investor13@vc.com', name: 'Brandon Scott', role: 'INVESTOR', firmName: 'Tech Growth', investmentFocus: 'Software, Cloud', bio: 'Technology growth investor', location: 'Austin, TX' },
    { email: 'investor14@vc.com', name: 'Mia Thompson', role: 'INVESTOR', firmName: 'BioMed Partners', investmentFocus: 'Biotech, Pharma', bio: 'Biotechnology investor', location: 'Boston, MA' },
    { email: 'investor15@vc.com', name: 'Alex Turner', role: 'INVESTOR', firmName: 'Energy Ventures', investmentFocus: 'Clean Energy', bio: 'Clean energy investor', location: 'Denver, CO' },
    { email: 'investor16@vc.com', name: 'Nicole Green', role: 'INVESTOR', firmName: 'Digital Health', investmentFocus: 'HealthTech, Digital Health', bio: 'Digital health investor', location: 'San Francisco, CA' },
    { email: 'investor17@vc.com', name: 'Tyler Adams', role: 'INVESTOR', firmName: 'Cyber Security Fund', investmentFocus: 'Cybersecurity, Privacy', bio: 'Cybersecurity investor', location: 'Washington, DC' },
    { email: 'investor18@vc.com', name: 'Hannah Lee', role: 'INVESTOR', firmName: 'Consumer Tech Fund', investmentFocus: 'Consumer, Mobile', bio: 'Consumer technology investor', location: 'Los Angeles, CA' },
    { email: 'investor19@vc.com', name: 'Jake Miller', role: 'INVESTOR', firmName: 'Infrastructure Capital', investmentFocus: 'Infrastructure, Cloud', bio: 'Infrastructure investor', location: 'New York, NY' },
    { email: 'investor20@vc.com', name: 'Olivia Brown', role: 'INVESTOR', firmName: 'Emerging Tech Fund', investmentFocus: 'Emerging Tech, AI', bio: 'Emerging technology investor', location: 'San Francisco, CA' },
  ]

  const investors = await Promise.all(
    investorsData.map(i => prisma.user.create({ data: { ...i, verificationStatus: 'VERIFIED', emailVerified: true } }))
  )
  console.log(`✅ Created ${investors.length} investors`)

  // Combine all users
  const allUsers = [...students, ...uniAdmins, ...employers, ...investors]

  // ==================== 20 PROJECTS ====================
  const projectsData = [
    {
      title: 'AI-Powered Learning Platform',
      description: 'Machine learning platform for personalized education',
      category: 'STARTUP',
      projectLeadId: students[0].id,
      hrLeadId: uniAdmins[0].id,
      universityId: universities[0].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 500000,
      investmentRaised: 250000,
      startDate: new Date('2024-01-15'),
      teamSize: 8,
    },
    {
      title: 'Autonomous Delivery System',
      description: 'Self-driving delivery vehicle technology for last-mile logistics',
      category: 'STARTUP',
      projectLeadId: students[1].id,
      hrLeadId: uniAdmins[1].id,
      universityId: universities[1].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 1000000,
      investmentRaised: 500000,
      startDate: new Date('2024-02-01'),
      teamSize: 12,
    },
    {
      title: 'Healthcare Analytics Platform',
      description: 'Big data analytics for healthcare outcomes improvement',
      category: 'RESEARCH',
      projectLeadId: students[2].id,
      hrLeadId: uniAdmins[2].id,
      universityId: universities[2].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 750000,
      investmentRaised: 375000,
      startDate: new Date('2024-01-20'),
      teamSize: 10,
    },
    {
      title: 'Blockchain Supply Chain',
      description: 'Decentralized supply chain tracking using blockchain technology',
      category: 'STARTUP',
      projectLeadId: students[3].id,
      universityId: universities[3].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 2000000,
      investmentRaised: 1000000,
      startDate: new Date('2024-03-01'),
      teamSize: 15,
    },
    {
      title: 'Smart Grid Management',
      description: 'AI-powered smart grid optimization for renewable energy',
      category: 'RESEARCH',
      projectLeadId: students[4].id,
      hrLeadId: uniAdmins[4].id,
      universityId: universities[4].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 1500000,
      investmentRaised: 750000,
      startDate: new Date('2024-02-15'),
      teamSize: 18,
    },
    {
      title: 'Cybersecurity AI Platform',
      description: 'AI-driven cybersecurity threat detection and response',
      category: 'STARTUP',
      projectLeadId: students[5].id,
      universityId: universities[5].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 3000000,
      investmentRaised: 1500000,
      startDate: new Date('2024-01-10'),
      teamSize: 20,
    },
    {
      title: 'Quantum Computing Simulator',
      description: 'Cloud-based quantum computing simulation platform',
      category: 'RESEARCH',
      projectLeadId: students[6].id,
      hrLeadId: uniAdmins[6].id,
      universityId: universities[6].id,
      status: 'RECRUITING',
      project.investmentSeeking: true,
      investmentGoal: 800000,
      investmentRaised: 200000,
      startDate: new Date('2024-03-15'),
      teamSize: 12,
    },
    {
      title: 'Sustainable Agriculture Tech',
      description: 'IoT sensors and AI for precision agriculture',
      category: 'STARTUP',
      projectLeadId: students[7].id,
      universityId: universities[7].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 1200000,
      investmentRaised: 600000,
      startDate: new Date('2024-02-01'),
      teamSize: 14,
    },
    {
      title: 'Autonomous Manufacturing',
      description: 'Robotics and AI for automated manufacturing lines',
      category: 'STARTUP',
      projectLeadId: students[8].id,
      hrLeadId: uniAdmins[8].id,
      universityId: universities[8].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 2500000,
      investmentRaised: 1250000,
      startDate: new Date('2024-01-05'),
      teamSize: 22,
    },
    {
      title: 'EdTech Learning Analytics',
      description: 'AI-powered learning analytics for educational institutions',
      category: 'STARTUP',
      projectLeadId: students[9].id,
      universityId: universities[9].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 900000,
      investmentRaised: 450000,
      startDate: new Date('2024-02-20'),
      teamSize: 10,
    },
    {
      title: 'Biotech Drug Discovery',
      description: 'AI-accelerated drug discovery platform',
      category: 'RESEARCH',
      projectLeadId: students[10].id,
      hrLeadId: uniAdmins[10].id,
      universityId: universities[10].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 5000000,
      investmentRaised: 2500000,
      startDate: new Date('2023-12-01'),
      teamSize: 25,
    },
    {
      title: 'FinTech Compliance Platform',
      description: 'Automated regulatory compliance for financial institutions',
      category: 'STARTUP',
      projectLeadId: students[11].id,
      universityId: universities[11].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 1500000,
      investmentRaised: 750000,
      startDate: new Date('2024-01-25'),
      teamSize: 16,
    },
    {
      title: 'Ethics in AI Framework',
      description: 'Comprehensive framework for ethical AI development',
      category: 'RESEARCH',
      projectLeadId: students[12].id,
      hrLeadId: uniAdmins[13].id,
      universityId: universities[12].id,
      status: 'ACTIVE',
      project.investmentSeeking: false,
      investmentGoal: 0,
      investmentRaised: 0,
      startDate: new Date('2024-01-01'),
      teamSize: 6,
    },
    {
      title: 'Quantum Cryptography',
      description: 'Post-quantum cryptography for secure communications',
      category: 'RESEARCH',
      projectLeadId: students[14].id,
      universityId: universities[14].id,
      status: 'RECRUITING',
      project.investmentSeeking: true,
      investmentGoal: 2000000,
      investmentRaised: 500000,
      startDate: new Date('2024-03-01'),
      teamSize: 8,
    },
    {
      title: 'Biomedical Imaging AI',
      description: 'Deep learning for medical image analysis',
      category: 'RESEARCH',
      projectLeadId: students[15].id,
      hrLeadId: uniAdmins[17].id,
      universityId: universities[15].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 3000000,
      investmentRaised: 1500000,
      startDate: new Date('2024-02-10'),
      teamSize: 12,
    },
    {
      title: 'Hospitality Tech Platform',
      description: 'Comprehensive platform for hospitality industry',
      category: 'STARTUP',
      projectLeadId: students[16].id,
      universityId: universities[16].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 600000,
      investmentRaised: 300000,
      startDate: new Date('2024-03-01'),
      teamSize: 8,
    },
    {
      title: 'Medical Device Innovation',
      description: 'Next-generation medical devices for remote monitoring',
      category: 'RESEARCH',
      projectLeadId: students[17].id,
      hrLeadId: uniAdmins[17].id,
      universityId: universities[17].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 4000000,
      investmentRaised: 2000000,
      startDate: new Date('2023-11-01'),
      teamSize: 20,
    },
    {
      title: 'Cinematic AI Platform',
      description: 'AI-powered video editing and production tools',
      category: 'STARTUP',
      projectLeadId: students[18].id,
      universityId: universities[18].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 1800000,
      investmentRaised: 900000,
      startDate: new Date('2024-02-05'),
      teamSize: 14,
    },
    {
      title: 'Aerospace Propulsion',
      description: 'Next-gen rocket propulsion technology',
      category: 'RESEARCH',
      projectLeadId: students[19].id,
      hrLeadId: uniAdmins[19].id,
      universityId: universities[19].id,
      status: 'ACTIVE',
      project.investmentSeeking: true,
      investmentGoal: 10000000,
      investmentRaised: 5000000,
      startDate: new Date('2023-10-01'),
      teamSize: 30,
    },
  ]

  const projects = await Promise.all(
    projectsData.map(p => prisma.project.create({ data: p }))
  )
  console.log(`✅ Created ${projects.length} projects`)

  // ==================== PROJECT MEMBERS & DEPARTMENTS ====================
  for (const project of projects) {
    const memberCount = Math.floor(Math.random() * 8) + 4
    const teamMembers = allUsers.filter(u => u.role !== 'INVESTOR').slice(0, memberCount)

    const projectMembers = await Promise.all(
      teamMembers.map((member, index) =>
        prisma.projectMember.create({
          data: {
            projectId: project.id,
            userId: member.id,
            role: index === 0 ? 'PROJECT_LEAD' : index === 1 ? 'HR_LEAD' : 'CONTRIBUTOR',
            assignedAt: new Date(),
            startDate: new Date(),
            contributionScore: Math.random() * 5,
          }
        })
      )
    )

    // Create departments
    const deptCount = Math.floor(Math.random() * 3) + 2
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Operations', 'Research', 'QA']
    for (let i = 0; i < deptCount; i++) {
      await prisma.department.create({
        data: {
          projectId: project.id,
          name: departments[i],
          description: `${departments[i]} department`,
          headId: teamMembers[Math.min(i, teamMembers.length - 1)]?.id,
          memberCount: Math.floor(Math.random() * 5) + 2,
          taskCount: Math.floor(Math.random() * 10) + 5,
        }
      })
    }

    // Update university project counts
    await prisma.university.update({
      where: { id: project.universityId || '' },
      data: { totalProjects: { increment: 1 } }
    })
  }
  console.log(`✅ Created project members and departments`)

  // ==================== 100 TASKS (5 per project) ====================
  const taskTitles = [
    'Research and Requirements', 'Design System Setup', 'Frontend Development', 'Backend API Development',
    'Database Design', 'Authentication Implementation', 'Unit Testing', 'Integration Testing',
    'Documentation', 'Code Review', 'Performance Optimization', 'Security Audit',
    'User Testing', 'Bug Fixes', 'Deployment', 'Monitoring Setup'
  ]

  for (const project of projects) {
    const taskCount = 5
    for (let i = 0; i < taskCount; i++) {
      const assignee = project.members.length > 0 ? allUsers[Math.floor(Math.random() * allUsers.length)] : undefined
      await prisma.task.create({
        data: {
          projectId: project.id,
          assigneeId: assignee?.id,
          creatorId: project.projectLeadId,
          title: taskTitles[i % taskTitles.length],
          description: `Complete ${taskTitles[i % taskTitles.length]} for ${project.title}`,
          status: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 4)],
          priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'][Math.floor(Math.random() * 4)],
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        }
      })
    }
  }
  console.log(`✅ Created tasks for all projects`)

  // ==================== 20 JOBS ====================
  const jobsData = [
    {
      employerId: employers[0].id,
      title: 'Senior Software Engineer',
      description: 'Build scalable web applications using modern frameworks',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'San Francisco, CA',
      remote: true,
      salaryMin: 120000,
      salaryMax: 180000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'PostgreSQL']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[1].id,
      title: 'Data Scientist',
      description: 'Develop machine learning models for business intelligence',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Austin, TX',
      remote: false,
      salaryMin: 130000,
      salaryMax: 200000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'SQL']),
      requiredLevel: 'ADVANCED',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[2].id,
      title: 'Product Manager',
      description: 'Lead product strategy and execution for startup',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'New York, NY',
      remote: true,
      salaryMin: 150000,
      salaryMax: 250000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Product Management', 'Agile', 'User Research', 'Roadmapping']),
      requiredLevel: 'SENIOR',
      experienceRequired: 7,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[3].id,
      title: 'DevOps Engineer',
      description: 'Build and maintain cloud infrastructure',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Seattle, WA',
      remote: true,
      salaryMin: 140000,
      salaryMax: 200000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['AWS', 'Kubernetes', 'Docker', 'Terraform']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 4,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[4].id,
      title: 'AI Research Engineer',
      description: 'Research and develop state-of-the-art AI models',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Cambridge, MA',
      remote: false,
      salaryMin: 180000,
      salaryMax: 280000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Deep Learning', 'PyTorch', 'TensorFlow', 'Research']),
      requiredLevel: 'EXPERT',
      experienceRequired: 6,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[5].id,
      title: 'Frontend Developer',
      description: 'Build beautiful and responsive user interfaces',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Berkeley, CA',
      remote: true,
      salaryMin: 110000,
      salaryMax: 160000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['React', 'TypeScript', 'CSS', 'Framer Motion']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 2,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[6].id,
      title: 'Backend Engineer',
      description: 'Design and implement scalable backend systems',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Chicago, IL',
      remote: true,
      salaryMin: 130000,
      salaryMax: 190000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'Redis']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[7].id,
      title: 'UX Designer',
      description: 'Create user-centered design solutions',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Boston, MA',
      remote: true,
      salaryMin: 100000,
      salaryMax: 150000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Figma', 'User Research', 'Prototyping', 'Visual Design']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 2,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[8].id,
      title: 'Full Stack Developer',
      description: 'Build complete web applications from database to UI',
      type: 'CONTRACT',
      status: 'PUBLISHED',
      location: 'Los Angeles, CA',
      remote: true,
      salaryMin: 80,
      salaryMax: 120,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'MongoDB']),
      requiredLevel: 'SENIOR',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[9].id,
      title: 'Marketing Manager',
      description: 'Lead marketing campaigns and brand strategy',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'New York, NY',
      remote: false,
      salaryMin: 90000,
      salaryMax: 140000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics']),
      requiredLevel: 'SENIOR',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[10].id,
      title: 'Software Engineer Intern',
      description: '12-week internship program for junior developers',
      type: 'INTERNSHIP',
      status: 'PUBLISHED',
      location: 'Chicago, IL',
      remote: true,
      salaryMin: 25,
      salaryMax: 35,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['Python', 'Java', 'Git', 'SQL']),
      requiredLevel: 'BEGINNER',
      experienceRequired: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[11].id,
      title: 'Mobile Developer',
      description: 'Develop native and cross-platform mobile applications',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Philadelphia, PA',
      remote: true,
      salaryMin: 120000,
      salaryMax: 180000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['Swift', 'Kotlin', 'React Native', 'Flutter']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[12].id,
      title: 'ML Engineer',
      description: 'Build and deploy machine learning models at scale',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Detroit, MI',
      remote: true,
      salaryMin: 150000,
      salaryMax: 220000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['TensorFlow', 'PyTorch', 'MLOps', 'Cloud Platforms']),
      requiredLevel: 'EXPERT',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[13].id,
      title: 'Bioinformatics Analyst',
      description: 'Analyze biological data using computational methods',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Boston, MA',
      remote: false,
      salaryMin: 90000,
      salaryMax: 140000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Python', 'R', 'Bioinformatics', 'Genomics']),
      requiredLevel: 'ADVANCED',
      experienceRequired: 4,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[14].id,
      title: 'Cybersecurity Analyst',
      description: 'Monitor and respond to security threats',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Washington, DC',
      remote: true,
      salaryMin: 110000,
      salaryMax: 170000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Penetration Testing', 'SIEM', 'Incident Response', 'Compliance']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[15].id,
      title: 'Renewable Energy Engineer',
      description: 'Design and implement renewable energy solutions',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Denver, CO',
      remote: false,
      salaryMin: 95000,
      salaryMax: 135000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Solar', 'Wind', 'Energy Storage', 'Grid Integration']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[16].id,
      title: 'Cloud Architect',
      description: 'Design scalable cloud architecture solutions',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Seattle, WA',
      remote: true,
      salaryMin: 160000,
      salaryMax: 250000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes']),
      requiredLevel: 'EXPERT',
      experienceRequired: 7,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[17].id,
      title: 'Food Scientist',
      description: 'Research and develop new food technologies',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'San Francisco, CA',
      remote: false,
      salaryMin: 90000,
      salaryMax: 140000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['Food Science', 'R&D', 'Lab Techniques', 'Product Development']),
      requiredLevel: 'ADVANCED',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[18].id,
      title: 'Real Estate Tech Developer',
      description: 'Build technology solutions for real estate industry',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Miami, FL',
      remote: true,
      salaryMin: 100000,
      salaryMax: 160000,
      salaryType: 'HOURLY',
      requiredSkills: JSON.stringify(['React', 'Node.js', 'Mapping APIs', 'Real Estate Knowledge']),
      requiredLevel: 'INTERMEDIATE',
      experienceRequired: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      employerId: employers[19].id,
      title: 'Aerospace Engineer',
      description: 'Design and test aerospace components and systems',
      type: 'FULL_TIME',
      status: 'PUBLISHED',
      location: 'Los Angeles, CA',
      remote: false,
      salaryMin: 120000,
      salaryMax: 180000,
      salaryType: 'ANNUAL',
      requiredSkills: JSON.stringify(['CAD', 'FEA', 'Materials', 'Testing']),
      requiredLevel: 'ADVANCED',
      experienceRequired: 5,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  ]

  const jobs = await Promise.all(
    jobsData.map(j => prisma.job.create({ data: { ...j, publishedAt: new Date() } }))
  )
  console.log(`✅ Created ${jobs.length} jobs`)

  // ==================== 50 SKILLS (for students) ====================
  const skillCategories = ['Programming', 'Data Science', 'Design', 'Marketing', 'Business', 'Engineering', 'Research', 'Management']
  const skillNames = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Product Management', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain', 'Mobile Development', 'Artificial Intelligence', 'Research', 'Leadership', 'Communication']

  const skillsData = []
  for (const student of students.slice(0, 15)) {
    const numSkills = Math.floor(Math.random() * 6) + 3
    for (let i = 0; i < numSkills; i++) {
      const skillName = skillNames[Math.floor(Math.random() * skillNames.length)]
      skillsData.push({
        userId: student.id,
        name: skillName,
        level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'][Math.floor(Math.random() * 4)],
        category: skillCategories[Math.floor(Math.random() * skillCategories.length)],
        yearsOfExperience: Math.floor(Math.random() * 5) + 1,
        verified: Math.random() > 0.7,
        endorsementCount: Math.floor(Math.random() * 20),
      })
    }
  }

  const skills = await Promise.all(
    skillsData.map(s => prisma.skill.create({ data: s }))
  )
  console.log(`✅ Created ${skills.length} skills`)

  // ==================== 50 RATINGS ====================
  const ratingData = []
  for (let i = 0; i < 50; i++) {
    const rater = allUsers[Math.floor(Math.random() * allUsers.length)]
    const rated = allUsers[Math.floor(Math.random() * allUsers.length)]
    const project = projects[Math.floor(Math.random() * projects.length)]
    ratingData.push({
      raterId: rater.id,
      ratedId: rated.id,
      dimension: ['EXECUTION', 'COLLABORATION', 'LEADERSHIP', 'ETHICS', 'RELIABILITY'][Math.floor(Math.random() * 5)],
      source: ['PEER', 'LEAD', 'MENTOR', 'EMPLOYER', 'UNIVERSITY'][Math.floor(Math.random() * 5)],
      projectId: project.id,
      score: Math.random() * 4 + 1,
      comment: 'Excellent performance and dedication to the project.',
    })
  }

  const ratings = await Promise.all(
    ratingData.map(r => prisma.rating.create({ data: r }))
  )
  console.log(`✅ Created ${ratings.length} ratings`)

  // ==================== 20 INVESTMENTS ====================
  const investmentsData = []
  for (let i = 0; i < 20; i++) {
    const investor = investors[i]
    const project = projects[i % projects.length]
    investmentsData.push({
      projectId: project.id,
      investorId: investor.id,
      type: ['EQUITY', 'REVENUE_SHARE', 'CONVERTIBLE_NOTE', 'GRANT'][Math.floor(Math.random() * 4)],
      status: project.investmentRaised > 0 ? 'FUNDED' : 'INTERESTED',
      amount: project.investmentRaised * (Math.random() * 0.5 + 0.5),
      equity: Math.random() * 10 + 5,
    })
  }

  const investments = await Promise.all(
    investmentsData.map(inv => prisma.investment.create({ data: inv }))
  )
  console.log(`✅ Created ${investments.length} investments`)

  // ==================== 20 MILESTONES ====================
  const milestoneTitles = ['Prototype Complete', 'MVP Launch', 'Beta Release', 'Product Launch', 'Series A Funding', 'Team Expansion', 'Market Validation', 'User Acquisition Target', 'Revenue Milestone', 'Partnership Signed']

  for (const project of projects) {
    const numMilestones = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < numMilestones; i++) {
      await prisma.milestone.create({
        data: {
          projectId: project.id,
          title: milestoneTitles[i % milestoneTitles.length],
          description: `Achieve ${milestoneTitles[i % milestoneTitles.length]} for ${project.title}`,
          status: ['NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'DELAYED'][Math.floor(Math.random() * 4)],
          targetDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000),
          metrics: JSON.stringify({ progress: Math.random() * 100 }),
        }
      })
    }
  }
  console.log(`✅ Created milestones for all projects`)

  // ==================== 30 TIME ENTRIES ====================
  for (const project of projects.slice(0, 15)) {
    const member = project.members[0] || allUsers[0]
    for (let i = 0; i < 2; i++) {
      const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      await prisma.timeEntry.create({
        data: {
          userId: member.id,
          type: ['WORK', 'BREAK', 'MEETING', 'TRAINING'][Math.floor(Math.random() * 4)],
          startTime,
          endTime: new Date(startTime.getTime() + Math.random() * 4 * 60 * 60 * 1000),
          duration: Math.random() * 4 + 1,
          description: `Working on ${project.title}`,
        }
      })
    }
  }
  console.log(`✅ Created time entries`)

  // ==================== 20 WORK SESSIONS ====================
  for (const student of students.slice(0, 20)) {
    await prisma.workSession.create({
      data: {
        userId: student.id,
        type: ['ONSITE', 'REMOTE', 'HYBRID'][Math.floor(Math.random() * 3)],
        checkInTime: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
        checkOutTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        duration: Math.random() * 6 + 2,
        checkInLocation: student.location,
        notes: 'Regular work session on project tasks',
      }
    })
  }
  console.log(`✅ Created work sessions`)

  // ==================== 30 PROFESSIONAL RECORDS ====================
  const recordTypes = ['PROJECT_ROLE', 'LEADERSHIP_POSITION', 'TASK_COMPLETION', 'SKILL_ACQUIRED', 'CERTIFICATION', 'ACHIEVEMENT']
  for (const student of students) {
    const numRecords = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numRecords; i++) {
      const project = projects[i % projects.length]
      await prisma.professionalRecord.create({
        data: {
          userId: student.id,
          type: recordTypes[i % recordTypes.length],
          title: `${recordTypes[i % recordTypes.length]} - ${project.title}`,
          description: `Participated in ${project.title} as ${recordTypes[i % recordTypes.length].toLowerCase()}`,
          projectId: project.id,
          startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          isVerified: Math.random() > 0.6,
          verifiedBy: uniAdmins[i % uniAdmins.length].id,
          verifiedAt: Math.random() > 0.6 ? new Date() : undefined,
        }
      })
    }
  }
  console.log(`✅ Created professional records`)

  // ==================== 30 MESSAGES ====================
  for (let i = 0; i < 30; i++) {
    const sender = allUsers[i % allUsers.length]
    const receiver = allUsers[(i + 1) % allUsers.length]
    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        projectId: projects[i % projects.length].id,
        content: `Hi, I wanted to discuss the ${projects[i % projects.length].title} project. Let me know your availability.`,
        type: 'TEXT',
        status: 'DELIVERED',
      }
    })
  }
  console.log(`✅ Created messages`)

  // ==================== 20 JOB APPLICATIONS ====================
  for (const job of jobs.slice(0, 20)) {
    const applicant = students[Math.floor(Math.random() * students.length)]
    await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        applicantId: applicant.id,
        status: ['PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED'][Math.floor(Math.random() * 5)],
        coverLetter: 'I am excited about this opportunity and believe my skills align well.',
      }
    })
  }
  console.log(`✅ Created job applications`)

  console.log('🎉 Seeding completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - ${universities.length} Universities`)
  console.log(`   - ${allUsers.length} Users (${students.length} students, ${uniAdmins.length} admins, ${employers.length} employers, ${investors.length} investors)`)
  console.log(`   - ${projects.length} Projects with teams and tasks`)
  console.log(`   - ${jobs.length} Jobs`)
  console.log(`   - ${skills.length} Skills`)
  console.log(`   - ${ratings.length} Ratings`)
  console.log(`   - ${investments.length} Investments`)
  console.log(`   - Milestones, Time Entries, Work Sessions, Messages, Applications, Professional Records created`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
