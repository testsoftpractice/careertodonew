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
  console.log('🌱 Starting comprehensive business-focused database seeding...')

  try {
    // Clear existing data
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
    await prisma.taskComment.deleteMany()
    await prisma.taskStep.deleteMany()
    await prisma.personalTask.deleteMany()
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
    await prisma.projectApproval.deleteMany()
    await prisma.jobApproval.deleteMany()

    console.log('✅ Existing data cleared')

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password123!', 10)
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    console.log('📚 Creating universities...')
    const universities = await Promise.all([
      // === PUBLIC UNIVERSITIES ===
      prisma.university.create({
        data: {
          name: 'University of Dhaka',
          code: 'DU001',
          description: 'Public research university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.du.ac.bd',
          rankingScore: 4.8,
          rankingPosition: 1,
          totalStudents: 35000,
          verificationStatus: 'VERIFIED',
          totalProjects: 120
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Rajshahi',
          code: 'RU001',
          description: 'Public research university in Rajshahi',
          location: 'Rajshahi, Bangladesh',
          website: 'https://www.ru.ac.bd',
          rankingScore: 4.6,
          rankingPosition: 2,
          totalStudents: 28000,
          verificationStatus: 'VERIFIED',
          totalProjects: 85
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Agricultural University',
          code: 'BAU001',
          description: 'Agricultural university in Mymensingh',
          location: 'Mymensingh, Bangladesh',
          website: 'https://www.bau.edu.bd',
          rankingScore: 4.5,
          rankingPosition: 3,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 45
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University of Engineering & Technology',
          code: 'BUET001',
          description: 'Premier engineering university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.buet.ac.bd',
          rankingScore: 4.9,
          rankingPosition: 1,
          totalStudents: 8000,
          verificationStatus: 'VERIFIED',
          totalProjects: 150
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Chittagong',
          code: 'CU001',
          description: 'Public research university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.cu.ac.bd',
          rankingScore: 4.6,
          rankingPosition: 4,
          totalStudents: 22000,
          verificationStatus: 'VERIFIED',
          totalProjects: 78
        }
      }),
      prisma.university.create({
        data: {
          name: 'Jahangirnagar University',
          code: 'JU001',
          description: 'Public research university in Savar',
          location: 'Savar, Dhaka, Bangladesh',
          website: 'https://www.juniv.edu',
          rankingScore: 4.7,
          rankingPosition: 3,
          totalStudents: 16000,
          verificationStatus: 'VERIFIED',
          totalProjects: 92
        }
      }),
      prisma.university.create({
        data: {
          name: 'Islamic University, Bangladesh',
          code: 'IU001',
          description: 'Public university in Kushtia',
          location: 'Kushtia, Bangladesh',
          website: 'https://www.iu.ac.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 12000,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Shahjalal University of Science & Technology',
          code: 'SUST001',
          description: 'Public research university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.sust.edu',
          rankingScore: 4.7,
          rankingPosition: 5,
          totalStudents: 9000,
          verificationStatus: 'VERIFIED',
          totalProjects: 88
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khulna University',
          code: 'KU001',
          description: 'Public research university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.ku.ac.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 55
        }
      }),
      prisma.university.create({
        data: {
          name: 'National University',
          code: 'NU001',
          description: 'Largest public university network in Bangladesh',
          location: 'Gazipur, Bangladesh',
          website: 'https://www.nu.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 10,
          totalStudents: 2500000,
          verificationStatus: 'VERIFIED',
          totalProjects: 500
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Open University',
          code: 'BOU001',
          description: 'Open and distance learning university',
          location: 'Gazipur, Bangladesh',
          website: 'https://www.bou.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 12,
          totalStudents: 450000,
          verificationStatus: 'VERIFIED',
          totalProjects: 80
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Medical University',
          code: 'BMU001',
          description: 'Medical education and research university',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.bsmmu.ac.bd',
          rankingScore: 4.6,
          rankingPosition: 6,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Gazipur Agricultural University',
          code: 'GAU001',
          description: 'Agricultural university in Gazipur',
          location: 'Gazipur, Bangladesh',
          website: 'https://gau.edu.bd/',
          rankingScore: 4.3,
          rankingPosition: 9,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Hajee Mohammad Danesh Science & Technology University',
          code: 'HSTU001',
          description: 'Science and technology university in Dinajpur',
          location: 'Dinajpur, Bangladesh',
          website: 'https://www.hstu.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 40
        }
      }),
      prisma.university.create({
        data: {
          name: 'Mawlana Bhashani Science & Technology University',
          code: 'MBSTU001',
          description: 'Science and technology university in Tangail',
          location: 'Tangail, Bangladesh',
          website: 'https://www.mbstu.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 12,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 36
        }
      }),
      prisma.university.create({
        data: {
          name: 'Patuakhali Science And Technology University',
          code: 'PSTU001',
          description: 'Science and technology university in Patuakhali',
          location: 'Patuakhali, Bangladesh',
          website: 'https://www.pstu.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sher-e-Bangla Agricultural University',
          code: 'SAU001',
          description: 'Agricultural university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.sau.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chittagong University of Engineering & Technology',
          code: 'CUET001',
          description: 'Engineering university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.cuet.ac.bd',
          rankingScore: 4.7,
          rankingPosition: 5,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 72
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rajshahi University of Engineering & Technology',
          code: 'RUET001',
          description: 'Engineering university in Rajshahi',
          location: 'Rajshahi, Bangladesh',
          website: 'https://www.ruet.ac.bd',
          rankingScore: 4.6,
          rankingPosition: 6,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 65
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khulna University of Engineering & Technology',
          code: 'KUET001',
          description: 'Engineering university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.kuet.ac.bd',
          rankingScore: 4.6,
          rankingPosition: 6,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 58
        }
      }),
      prisma.university.create({
        data: {
          name: 'Dhaka University of Engineering & Technology',
          code: 'DUET001',
          description: 'Engineering university in Gazipur',
          location: 'Gazipur, Bangladesh',
          website: 'https://www.duet.ac.bd',
          rankingScore: 4.5,
          rankingPosition: 7,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 52
        }
      }),
      prisma.university.create({
        data: {
          name: 'Noakhali Science & Technology University',
          code: 'NSTU001',
          description: 'Science and technology university in Noakhali',
          location: 'Noakhali, Bangladesh',
          website: 'https://www.nstu.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 15,
          totalStudents: 4200,
          verificationStatus: 'VERIFIED',
          totalProjects: 34
        }
      }),
      prisma.university.create({
        data: {
          name: 'Jagannath University',
          code: 'JNU001',
          description: 'Public university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.jnu.ac.bd',
          rankingScore: 4.3,
          rankingPosition: 9,
          totalStudents: 15000,
          verificationStatus: 'VERIFIED',
          totalProjects: 62
        }
      }),
      prisma.university.create({
        data: {
          name: 'Comilla University',
          code: 'COU001',
          description: 'Public university in Comilla',
          location: 'Comilla, Bangladesh',
          website: 'https://www.cou.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Jatiya Kabi Kazi Nazrul Islam University',
          code: 'JKKNIU001',
          description: 'Arts and cultural university in Trishal',
          location: 'Mymensingh, Bangladesh',
          website: 'https://www.jkkniu.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 16,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chittagong Veterinary and Animal Sciences University',
          code: 'CVASU001',
          description: 'Veterinary and animal sciences university',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.cvasu.ac.bd',
          rankingScore: 4.3,
          rankingPosition: 9,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sylhet Agricultural University',
          code: 'SAUSY001',
          description: 'Agricultural university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.sau.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Jessore University of Science & Technology',
          code: 'JUST001',
          description: 'Science and technology university in Jessore',
          location: 'Jessore, Bangladesh',
          website: 'https://www.just.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Pabna University of Science and Technology',
          code: 'PUST001',
          description: 'Science and technology university in Pabna',
          location: 'Pabna, Bangladesh',
          website: 'https://www.pust.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4200,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      })
    ])

    console.log('✅ Created', universities.length, 'universities')

    // Get some universities for student assignment
    const du = universities[0]  // University of Dhaka
    const ru = universities[1]  // University of Rajshahi
    const bau = universities[2]  // Bangladesh Agricultural University

    console.log('👥 Creating users...')
    const platformAdmin = await prisma.user.create({
      data: {
        email: 'admin@platform.com',
        name: 'Platform Administrator',
        password: hashedPassword,
        role: 'PLATFORM_ADMIN',
        verificationStatus: 'VERIFIED',
        emailVerified: true,
        emailVerifiedAt: now,
        universityId: null,
        major: null,
        graduationYear: null,
        bio: 'Platform administrator with full access to all system features',
        location: 'Dhaka, Bangladesh',
        totalPoints: 1000,
        executionScore: 9.5,
        collaborationScore: 9.0,
        leadershipScore: 9.5,
        ethicsScore: 9.8,
        reliabilityScore: 9.7,
        progressionLevel: 'EXPERT'
      }
    })

    // Create students
    const students = await Promise.all([
      prisma.user.create({
        data: {
          email: 'ahmed.rahman@du.ac.bd',
          name: 'Ahmed Rahman',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: du.id,
          major: 'Computer Science and Engineering',
          graduationYear: 2025,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 750,
          executionScore: 8.5,
          collaborationScore: 8.0,
          leadershipScore: 7.5,
          ethicsScore: 9.0,
          reliabilityScore: 9.2,
          progressionLevel: 'ADVANCED'
        }
      }),
      prisma.user.create({
        data: {
          email: 'fatima.khan@du.ac.bd',
          name: 'Fatima Khan',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: du.id,
          major: 'Electrical and Electronic Engineering',
          graduationYear: 2025,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 820,
          executionScore: 9.0,
          collaborationScore: 8.5,
          leadershipScore: 8.0,
          ethicsScore: 9.2,
          reliabilityScore: 9.5,
          progressionLevel: 'ADVANCED'
        }
      }),
      prisma.user.create({
        data: {
          email: 'kamal.hasan@ru.ac.bd',
          name: 'Kamal Hasan',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: ru.id,
          major: 'Mechanical Engineering',
          graduationYear: 2025,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 680,
          executionScore: 7.5,
          collaborationScore: 8.0,
          leadershipScore: 7.0,
          ethicsScore: 8.8,
          reliabilityScore: 9.0,
          progressionLevel: 'INTERMEDIATE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'sarah.akter@bau.edu.bd',
          name: 'Sarah Akter',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: bau.id,
          major: 'Agricultural Engineering',
          graduationYear: 2026,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 580,
          executionScore: 8.0,
          collaborationScore: 8.5,
          leadershipScore: 7.5,
          ethicsScore: 9.0,
          reliabilityScore: 9.2,
          progressionLevel: 'INTERMEDIATE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'rahim.uddin@just.edu.bd',
          name: 'Rahim Uddin',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: just.edu.bd, // Will need to create or reference existing
          major: 'Environmental Science',
          graduationYear: 2026,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 720,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 8.0,
          ethicsScore: 9.2,
          reliabilityScore: 9.0,
          progressionLevel: 'ADVANCED'
        }
      }),
      prisma.user.create({
        data: {
          email: 'nadia.ahmed@du.ac.bd',
          name: 'Nadia Ahmed',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: du.id,
          major: 'Business Administration',
          graduationYear: 2025,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 890,
          executionScore: 9.0,
          collaborationScore: 9.5,
          leadershipScore: 8.5,
          ethicsScore: 9.0,
          reliabilityScore: 9.8,
          progressionLevel: 'EXPERT'
        }
      }),
      prisma.user.create({
        data: {
          email: 'tareq.mahmud@ru.ac.bd',
          name: 'Tareq Mahmud',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: ru.id,
          major: 'Civil Engineering',
          graduationYear: 2026,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 650,
          executionScore: 7.0,
          collaborationScore: 7.5,
          leadershipScore: 6.5,
          ethicsScore: 8.5,
          reliabilityScore: 9.0,
          progressionLevel: 'INTERMEDIATE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'zahid.hassan@bau.edu.bd',
          name: 'Zahid Hassan',
          password: hashedPassword,
          role: 'STUDENT',
          universityId: bau.id,
          major: 'Computer Science and Engineering',
          graduationYear: 2025,
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 770,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 8.5,
          ethicsScore: 9.2,
          reliabilityScore: 9.0,
          progressionLevel: 'ADVANCED'
        }
      })
    ])

    // Create employers
    const employers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'emily.chen@globaltradehub.com',
          name: 'Emily Chen',
          password: hashedPassword,
          role: 'EMPLOYER',
          company: 'Global Trade Hub Limited',
          position: 'Managing Director',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1200,
          executionScore: 9.5,
          collaborationScore: 9.0,
          leadershipScore: 9.5,
          ethicsScore: 9.8,
          reliabilityScore: 9.7,
          progressionLevel: 'EXPERT',
          bio: '20+ years in international trade and logistics management',
          location: 'Dhaka, Bangladesh',
          linkedinUrl: 'https://linkedin.com/in/emilychen'
        }
      }),
      prisma.user.create({
        data: {
          email: 'marcus.williams@recruitpro.com',
          name: 'Marcus Williams',
          password: hashedPassword,
          role: 'EMPLOYER',
          company: 'RecruitPro Professional Services',
          position: 'CEO',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1100,
          executionScore: 9.0,
          collaborationScore: 9.5,
          leadershipScore: 9.0,
          ethicsScore: 9.5,
          reliabilityScore: 9.2,
          progressionLevel: 'EXPERT',
          bio: '15+ years in professional recruitment and HR consulting',
          location: 'Chittagong, Bangladesh',
          linkedinUrl: 'https://linkedin.com/in/marcuswilliams'
        }
      }),
      prisma.user.create({
        data: {
          email: 'sofia.martinez@virtusol.com',
          name: 'Sofia Martinez',
          password: hashedPassword,
          role: 'EMPLOYER',
          company: 'VirtualSol Solutions Ltd',
          position: 'Operations Director',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1050,
          executionScore: 9.0,
          collaborationScore: 9.0,
          leadershipScore: 9.0,
          ethicsScore: 9.5,
          reliabilityScore: 9.0,
          progressionLevel: 'EXPERT',
          bio: '12+ years in virtual assistance and remote team management',
          location: 'Dhaka, Bangladesh',
          linkedinUrl: 'https://linkedin.com/in/sofiamartinez'
        }
      }),
      prisma.user.create({
        data: {
          email: 'james.rodriguez@studyabroad.com',
          name: 'James Rodriguez',
          password: hashedPassword,
          role: 'EMPLOYER',
          company: 'Study Abroad Consulting Group',
          position: 'Founder & CEO',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 950,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 9.0,
          ethicsScore: 9.2,
          reliabilityScore: 8.8,
          progressionLevel: 'EXPERT',
          bio: '10+ years in international education consulting',
          location: 'Dhaka, Bangladesh',
          linkedinUrl: 'https://linkedin.com/in/jamesrodriguez'
        }
      }),
      prisma.user.create({
        data: {
          email: 'abdul.karim@textiledges.com',
          name: 'Abdul Karim',
          password: hashedPassword,
          role: 'EMPLOYER',
          company: 'Textiles and Garments Ltd',
          position: 'Managing Director',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 980,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 8.5,
          ethicsScore: 9.0,
          reliabilityScore: 9.0,
          progressionLevel: 'ADVANCED',
          bio: 'Family-owned textile manufacturing business with international clients',
          location: 'Dhaka, Bangladesh',
          linkedinUrl: 'https://linkedin.com/in/abdulkarim'
        }
      })
    ])

    // Create investors
    const investors = await Promise.all([
      prisma.user.create({
        data: {
          email: 'robert.hsu@vcfirm.asia',
          name: 'Robert Hsu',
          password: hashedPassword,
          role: 'INVESTOR',
          company: 'Venture Capital Asia',
          position: 'Managing Partner',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1500,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 9.5,
          ethicsScore: 9.0,
          reliabilityScore: 9.5,
          progressionLevel: 'EXPERT',
          bio: '15+ years in venture capital and private equity',
          location: 'Singapore',
          linkedinUrl: 'https://linkedin.com/in/roberthsu'
        }
      }),
      prisma.user.create({
        data: {
          email: 'priya.sharma@techventures.com',
          name: 'Priya Sharma',
          password: hashedPassword,
          role: 'INVESTOR',
          company: 'TechVentures India',
          position: 'General Partner',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1350,
          executionScore: 8.0,
          collaborationScore: 8.5,
          leadershipScore: 9.0,
          ethicsScore: 8.8,
          reliabilityScore: 9.0,
          progressionLevel: 'ADVANCED',
          bio: '12+ years investing in technology startups',
          location: 'Bangalore, India',
          linkedinUrl: 'https://linkedin.com/in/priyasharma'
        }
      }),
      prisma.user.create({
        data: {
          email: 'david.lim@seedcap.hk',
          name: 'David Lim',
          password: hashedPassword,
          role: 'INVESTOR',
          company: 'Seed Capital Hong Kong',
          position: 'Partner',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 1200,
          executionScore: 8.5,
          collaborationScore: 9.0,
          leadershipScore: 8.5,
          ethicsScore: 9.2,
          reliabilityScore: 9.0,
          progressionLevel: 'ADVANCED',
          bio: 'Angel investor focusing on South Asian market opportunities',
          location: 'Hong Kong',
          linkedinUrl: 'https://linkedin.com/in/davidlim'
        }
      }),
      prisma.user.create({
        data: {
          email: 'alex.thompson@horizon.vc',
          name: 'Alex Thompson',
          password: hashedPassword,
          role: 'INVESTOR',
          company: 'Horizon Ventures',
          position: 'Investment Manager',
          verificationStatus: 'VERIFIED',
          emailVerified: true,
          emailVerifiedAt: now,
          totalPoints: 980,
          executionScore: 8.0,
          collaborationScore: 8.5,
          leadershipScore: 8.0,
          ethicsScore: 9.0,
          reliabilityScore: 8.8,
          progressionLevel: 'INTERMEDIATE',
          bio: 'Early-stage technology investor',
          location: 'Singapore',
          linkedinUrl: 'https://linkedin.com/in/alexthompson'
        }
      })
    ])

    console.log('✅ Created', students.length + employers.length + investors.length + 1, 'users')
    console.log('   - Platform Admin: 1 (admin@platform.com)')
    console.log('   - Students:', students.length)
    console.log('   - Employers:', employers.length)
    console.log('   - Investors:', investors.length)

    // Create businesses for employers
    console.log('💼 Creating businesses...')
    const businesses = await Promise.all([
      prisma.business.create({
        data: {
          name: 'Global Trade Hub Limited',
          description: 'Full-service trading company specializing in import/export facilitation, logistics, and cross-border trade management. We help businesses navigate international trade regulations and customs procedures.',
          industry: 'Logistics & Supply Chain',
          website: 'https://globaltradehub.com',
          location: 'Dhaka, Bangladesh',
          foundedYear: 2008,
          employees: 45,
          type: 'LIMITED_COMPANY',
          stage: 'GROWTH'
        }
      }),
      prisma.business.create({
        data: {
          name: 'RecruitPro Professional Services',
          description: 'Professional recruitment agency specializing in placing candidates at top companies across industries. Our team has 15+ years of experience in talent acquisition and HR consulting.',
          industry: 'Human Resources',
          website: 'https://recruitpro.com',
          location: 'Chittagong, Bangladesh',
          foundedYear: 2009,
          employees: 25,
          type: 'LIMITED_COMPANY',
          stage: 'MATURE'
        }
      }),
      prisma.business.create({
        data: {
          name: 'VirtualSol Solutions Ltd',
          description: 'Providing virtual assistance, administrative support, and back-office services to businesses worldwide. Our team of 50+ VAs can handle any administrative task efficiently.',
          industry: 'Business Services',
          website: 'https://virtusol.com',
          location: 'Dhaka, Bangladesh',
          foundedYear: 2015,
          employees: 52,
          type: 'LIMITED_COMPANY',
          stage: 'EXPANDING'
        }
      }),
      prisma.business.create({
        data: {
          name: 'Study Abroad Consulting Group',
          description: 'Premier education consultancy helping students get admitted to top universities worldwide. We provide guidance on applications, visa support, and pre-departure preparation.',
          industry: 'Education',
          website: 'https://studyabroad.com',
          location: 'Dhaka, Bangladesh',
          foundedYear: 2012,
          employees: 20,
          type: 'LIMITED_COMPANY',
          stage: 'MATURE'
        }
      }),
      prisma.create({
        data: {
          name: 'Textiles and Garments Ltd',
          description: 'Family-owned textile manufacturer with B2B and B2C operations. We produce and export quality garments to global markets with a focus on sustainable and ethical manufacturing.',
          industry: 'Textile & Fashion',
          website: 'https://textilesgarments.com',
          location: 'Dhaka, Bangladesh',
          foundedYear: 2005,
          employees: 150,
          type: 'LIMITED_COMPANY',
          stage: 'MATURE'
        }
      })
    ])

    console.log('✅ Created', businesses.length, 'businesses')

    // Link employers to their businesses
    for (let i = 0; i < employers.length; i++) {
      await prisma.businessMember.create({
        data: {
          businessId: businesses[i].id,
          userId: employers[i].id,
          role: 'OWNER',
          joinedAt: now
        }
      })
    }
    console.log('✅ Created', businesses.length, 'business members')

    // Add business skills
    console.log('🎓 Creating business skills...')
    const skills = [
      // Global Trade Hub skills
      'International Trade', 'Supply Chain Management', 'Customs & Regulations', 'Logistics Planning', 'Import/Export Documentation', 'Cross-Cultural Communication', 'Risk Assessment', 'Trade Finance', 'Warehouse Management'],
      // RecruitPro skills
      'Talent Sourcing', 'Interview Techniques', 'HR Consulting', 'Executive Search', 'Recruitment Marketing', 'Candidate Assessment', 'Onboarding Process', 'HR Analytics', 'Employee Relations',
      // VirtualSol skills
      'Virtual Assistance', 'Administrative Support', 'Email Management', 'Calendar Management', 'Data Entry', 'Customer Support', 'Project Management', 'Communication', 'Time Management', 'Microsoft Office', 'Google Workspace',
      // Study Abroad skills
      'Education Consulting', 'University Applications', 'Visa Documentation', 'Essay Writing', 'Interview Preparation', 'Counseling', 'IELTS/TOEFL Prep', 'Financial Planning', 'Cultural Orientation',
      // Textiles & Garments skills
      'Textile Manufacturing', 'Quality Control', 'Production Planning', 'Inventory Management', 'Export Documentation', 'Sustainable Sourcing', 'Fashion Design', 'Supply Chain', 'Market Research', 'Compliance'
    ]

    for (const skillName of skills) {
      await prisma.skill.create({
        data: {
          name: skillName,
          category: skillName.includes('Trade') ? 'Trade' : skillName.includes('Recruit') ? 'HR' : skillName.includes('Virtual') ? 'Business Services' : skillName.includes('Study') ? 'Education' : 'Manufacturing'
        }
      })
    }
    console.log('✅ Created', skills.length, 'business skills')

    // Add business experiences
    console.log('🎓 Creating business experiences...')
    await Promise.all([
      prisma.experience.create({
        data: {
          userId: employers[0].id,
          title: 'Managing Director',
          company: 'Global Trade Hub Limited',
          location: 'Dhaka, Bangladesh',
          startDate: new Date('2018-06-01'),
          endDate: null,
          current: true,
          description: 'Leading international trade operations for 7 years. Managed team of 45 professionals. Increased revenue by 200% through strategic partnerships and market expansion.',
          achievements: [
            'Established trade relationships with 50+ international partners',
            'Increased annual revenue from $5M to $15M',
            'Expanded operations to 15+ countries',
            'Implemented digital transformation for trade documentation'
          ]
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[1].id,
          title: 'Founder & CEO',
          company: 'RecruitPro Professional Services',
          location: 'Chittagong, Bangladesh',
          startDate: new Date('2009-03-01'),
          endDate: null,
          current: true,
          description: 'Founded and grew HR agency from scratch to industry leader in Bangladesh. Managed 200+ executive placements in multinational companies.',
          achievements: [
            'Established 50+ client relationships',
            '95% client satisfaction rate',
            'Recognized as Top 10 HR Agency in Bangladesh',
            'Received Best HR Service Award 2023'
          ]
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[2].id,
          title: 'Operations Director',
          company: 'VirtualSol Solutions Ltd',
          location: 'Dhaka, Bangladesh',
          startDate: new Date('2015-08-01'),
          endDate: null,
          current: true,
          description: 'Scaled virtual assistance operations from 5 to 52 team members. Implemented quality standards and client onboarding processes.',
          achievements: [
            'Achieved 98% client retention rate',
            'Implemented 24/7 support model',
            'Reduced average response time by 60%',
            'Expanded client base to 4 continents'
          ]
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[3].id,
          title: 'Founder & CEO',
          company: 'Study Abroad Consulting Group',
          location: 'Dhaka, Bangladesh',
          startDate: new Date('2012-01-01'),
          endDate: null,
          current: true,
          description: 'Pioneered study abroad services in Bangladesh. Helped 500+ students get admitted to top universities in UK, USA, Canada, Australia.',
          achievements: [
            '98% university admission success rate',
            'Students placed at top 50 universities worldwide',
            'Partnered with 100+ universities',
            'Awarded Excellence in Education 2022'
          ]
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[4].id,
          title: 'Managing Director',
          company: 'Textiles and Garments Ltd',
          location: 'Dhaka, LE: New York, USA',
          startDate: new Date('2015-01-01'),
          endDate: null,
          current: true,
          description: 'Leading textile export business for 9 years. Expanded market to 25 countries. Achieved $10M annual revenue.',
          achievements: [
            'Exported to 25+ countries',
            'Implemented sustainable sourcing',
            'Received GOTS certification',
            'Built direct buyer relationships'
          ]
        }
      })
    ])
    console.log('✅ Created', 6, 'business experiences')

    // Add education records
    console.log('🎓 Creating education records...')
    await Promise.all([
      prisma.education.create({
        data: {
          userId: platformAdmin.id,
          institution: 'Massachusetts Institute of Technology',
          degree: 'Master of Business Administration',
          field: 'Technology Management',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2017-05-31'),
          gpa: 4.0,
          current: false
        }
      }),
      prisma.education.create({
        data: {
          userId: platformAdmin.id,
          institution: 'Harvard University',
          degree: 'Bachelor of Computer Science',
          field: 'Computer Science',
          startDate: new Date('2011-09-01'),
          endDate: new Date('2015-05-31'),
          gpa: 3.9,
          current: false
        }
      })
    ])
    console.log('✅ Created', 2, 'education records')

    // Create BUSINESS-FOCUSED PROJECTS with PENDING approval status
    console.log('📋 Creating business-focused projects...')

    // Project 1: Cross-Border Trade Facilitation
    const project1 = await prisma.project.create({
      data: {
        name: 'Bangladesh-German Trade Facilitation Platform',
        description: 'A digital platform facilitating trade relationships between Bangladeshi exporters and German buyers. The platform streamlines documentation, automates compliance checks, and provides real-time tracking of shipments and payments.',
        category: 'SUPPLY_CHAIN',
        status: 'IDEA',
        stage: 'PLANNING',
        ownerId: employers[0].id,
        businessId: businesses[0].id,
        universityId: du.id,
        startDate: tomorrow,
        budget: 500000,
        seekingInvestment: true,
        progress: 25,
        tags: ['trade', 'export', 'import', 'germany', 'b2b', 'platform'],
        imageUrl: null,
        approvalStatus: 'PENDING',
        submissionDate: now,
        createdAt: now
      }
    })

    // Project 2: Professional Recruitment Automation
    const project2 = await prisma.project.create({
      data: {
        name: 'AI-Powered Recruitment Platform',
        description: 'An AI-driven platform that matches candidates with job openings using advanced algorithms. Includes automated screening, interview scheduling, and onboarding automation. Reduces time-to-hire by 60%.',
        category: 'TECHNOLOGY',
        status: 'PLANNING',
        stage: 'PLANNING',
        ownerId: employers[1].id,
        businessId: businesses[1].id,
        universityId: du.id,
        startDate: nextWeek,
        budget: 350000,
        seekingInvestment: true,
        progress: 40,
        tags: ['ai', 'recruitment', 'hr', 'automation', 'scheduling'],
        imageUrl: null,
        approvalStatus: 'PENDING',
        submissionDate: now,
        createdAt: now
      }
    })

    // Project 3: Virtual Assistant Marketplace
    const project3 = await prisma.project.create({
      data: {
        name: 'Global Virtual Assistant Network',
        description: 'A marketplace connecting businesses with pre-vetted virtual assistants across multiple time zones. Includes skill-based matching, automatic time zone routing, and integrated payment processing.',
        category: 'SERVICES',
        status: 'PLANNING',
        stage: 'PLANNING',
        ownerId: employers[2].id,
        businessId: businesses[2].id,
        universityId: ru.id,
        startDate: nextWeek,
        budget: 280000,
        seekingInvestment: true,
        progress: 30,
        tags: ['va', 'virtual', 'remote work', 'marketplace', 'freelance'],
        imageUrl: null,
        approvalStatus: 'PENDING',
        submissionDate: now,
        createdAt: now
      }
    })

    // Project 4: Educational Technology Platform
    const project4 = await prisma.project.create({
      data: {
        name: 'Student Career Development Platform',
        description: 'Comprehensive platform helping students build portfolios, track achievements, and connect with opportunities. Features include project showcases, skill assessments, and mentorship programs.',
        category: 'EDUCATION',
        status: 'PLANNING',
        stage: 'PLANNING',
        ownerId: employers[3].id,
        businessId: businesses[3].id,
        universityId: bau.id,
        startDate: nextMonth,
        budget: 200000,
        seekingInvestment: false,
        progress: 15,
        tags: ['education', 'students', 'career', 'portfolio', 'mentorship'],
        imageUrl: null,
        approvalStatus: 'PENDING',
        submissionDate: now,
        createdAt: now
      }
    })

    // Project 5: Sustainable Supply Chain Tracking
    const project5 = await prisma.project.create({
      data: {
        name: 'Sustainable Textile Supply Chain Tracker',
        description: 'Blockchain-based platform providing full visibility into textile supply chains. Tracks products from raw materials to finished goods, verifies sustainability claims, and manages compliance documentation.',
        category: 'SUSTAINABILITY',
        status: 'PLANNING',
        stage: 'PLANNING',
        ownerId: employers[4].id,
        businessId: businesses[4].id,
        universityId: null,
        startDate: nextMonth,
        budget: 750000,
        seekingInvestment: true,
        progress: 10,
        tags: ['textile', 'supply chain', 'sustainability', 'blockchain', 'compliance'],
        imageUrl: null,
        approvalStatus: 'PENDING',
        submissionDate: now,
        createdAt: now
      }
    })

    const projects = [project1, project2, project3, project4, project5]

    console.log('✅ Created', projects.length, 'business-focused projects')

    // Create project team members for each project
    console.log('👥 Adding project team members...')
    const allProjectMembers = []

    for (const project of projects) {
      // Add owner as member
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: project.ownerId,
          role: 'OWNER',
          accessLevel: 'FULL',
          joinedAt: now
        }
      })

      // Add team members from relevant roles
      const teamMembers = [
        { user: students[0], role: 'LEAD_ENGINEER' },
        { user: students[1], role: 'LEAD_DESIGNER' },
        { user: students[2], role: 'ENGINEER' },
        { user: students[3], role: 'ENGINEER' },
        { user: students[5], role: 'ENGINEER' },
        { user: students[6], role: 'ENGINEER' },
      ]

      for (const member of teamMembers) {
        await prisma.projectMember.create({
          data: {
            projectId: project.id,
            userId: member.user.id,
            role: member.role,
            accessLevel: member.role === 'LEAD_ENGINEER' ? 'FULL' : 'EDIT',
            joinedAt: now
          }
        })
      }
      allProjectMembers.push(...teamMembers.map(m => ({...m, projectId: project.id})))
    }
    console.log('✅ Created', allProjectMembers.length, 'project team members')

    // Create departments for each project
    console.log('🏢 Creating departments for each project...')
    const allDepartments = []

    for (const project of projects) {
      const departments = await Promise.all([
        prisma.department.create({
          data: {
            name: 'Documentation & Compliance',
            description: 'Handles all documentation, trade documentation, certificates, and regulatory compliance checks',
            projectId: project.id,
            headId: project.ownerId
          }
        }),
        prisma.department.create({
          data: {
            name: 'Logistics & Operations',
            description: 'Manages logistics, shipping, customs clearance, and delivery tracking',
            projectId: project.id,
            headId: students[0].id // Student lead for logistics
          }
        }),
        prisma.department.create({
          data: {
            name: 'Quality Control',
            description: 'Ensures quality standards are met throughout the project lifecycle',
            projectId: project.id,
            headId: students[1].id // Student lead for quality
          }
        }),
        prisma.department.create({
          data: {
            name: 'Client Relations',
            description: 'Manages client communications, requirements gathering, and satisfaction',
            projectId: project.id,
            headId: project.ownerId
          }
        })
      ])
      allDepartments.push(...departments)
    }
    console.log('✅ Created', allDepartments.length, 'departments')

    // Create milestones for each project
    console.log('✅ Creating milestones for each project...')
    const allMilestones = []

    for (const project of projects) {
      const milestones = await Promise.all([
        prisma.milestone.create({
          data: {
            title: 'Project Planning Complete',
            description: 'Initial planning, requirements gathering, and project kickoff completed',
            projectId: project.id,
            dueDate: project.startDate,
            status: 'COMPLETED',
            completedAt: now
          }
        }),
        prisma.milestone.create({
          data: {
            title: 'Development Phase 1 Complete',
            description: 'Core functionality and MVP development completed',
            projectId: project.id,
            dueDate: new Date(project.startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
            status: 'IN_PROGRESS'
          }
        }),
        prisma.milestone.create({
          data: {
            title: 'Beta Testing Complete',
            description: 'Beta version tested with selected users, feedback incorporated',
            projectId: project.id,
            dueDate: new Date(project.startDate.getTime() + 90 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        }),
        prisma.milestone.create({
          data: {
            title: 'Official Launch',
            description: 'Public launch of the platform with all features enabled',
            projectId: project.id,
            dueDate: new Date(project.startDate.getTime() + 120 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        }),
        prisma.milestone.create({
          data: {
            title: 'Post-Launch Review',
            description: 'Review and optimize based on user feedback and analytics',
            projectId: project.id,
            dueDate: new Date(project.startDate.getTime() + 180 * 24 * 60 * 60 * 1000),
            status: 'PENDING'
          }
        })
      ])
      allMilestones.push(...milestones)
    }
    console.log('✅ Created', allMilestones.length, 'milestones')

    // Create comprehensive tasks for each project
    console.log('📋 Creating comprehensive tasks for each project...')
    const allTasks = []

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      const startDate = project.startDate || now
      const weekLater = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)

      const tasks = await Promise.all([
        // Week 1 tasks
        prisma.task.create({
          data: {
            title: 'Requirements Analysis & Documentation',
            description: 'Gather all project requirements and create comprehensive documentation',
            projectId: project.id,
            assignedTo: students[i % students.length].id,
            assignedBy: project.ownerId,
            priority: i % 2 === 0 ? 'CRITICAL' : 'HIGH',
            dueDate: weekLater,
            estimatedHours: 8,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Technical Architecture Design',
            description: 'Design technical architecture including system components, data models, and interfaces',
            projectId: project.id,
            assignedTo: students[(i + 1) % students.length].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: weekLater,
            estimatedHours: 12,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Team Structure Definition',
            description: 'Define team roles, responsibilities, and reporting structure',
            projectId: project.id,
            assignedTo: students[(i + 2) % students.length].id,
            assignedBy: project.ownerId,
            priority: 'MEDIUM',
            dueDate: weekLater,
            estimatedHours: 6,
            status: 'TODO',
            currentStepId: '1'
          }
        }),

        // Week 2 tasks
        prisma.task.create({
          data: {
            title: 'Core Development Phase 1',
            description: 'Begin implementation of core features and functionalities',
            projectId: project.id,
            assignedTo: students[0].id,
            assignedBy: project.ownerId,
            priority: 'CRITICAL',
            dueDate: new Date(weekLater.getTime() + 7 * 24 * 60 * 60 * 1000),
            estimatedHours: 40,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'API Development',
            description: 'Build RESTful APIs with proper documentation and testing',
            projectId: project.id,
            assignedTo: students[1].id,
            assignedBy: project.ownerId,
            priority: 'CRITICAL',
            dueDate: new Date(weekLater.getTime() + 7 * 24 * 60 * 60 * 1000),
            estimatedHours: 32,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Database Design & Implementation',
            description: 'Design and implement database schema, migrations, and optimization',
            projectId: project.id,
            assignedTo: students[2].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 7 * 24 * 60 * 60 * 1000),
            estimatedHours: 24,
            status: 'TODO',
            currentStepId: '1'
          }
        }),

        // Week 3 tasks
        prisma.task.create({
          data: {
            title: 'User Interface Development',
            description: 'Build responsive and accessible user interfaces',
            projectId: project.id,
            assignedTo: students[3].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 14 * 24 * 60 * 60 * 1000),
            estimatedHours: 36,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Integration Testing',
            description: 'Integrate all components and test end-to-end flows',
            projectId: project.id,
            assignedTo: students[4].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 14 * 24 * 60 * 60 * 1000),
            estimatedHours: 28,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Security & Performance Testing',
            description: 'Conduct security audits and performance optimization',
            projectId: project.id,
            assignedTo: students[5].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 14 * 24 * 60 * 60 * 1000),
            estimatedHours: 20,
            status: 'TODO',
            currentStepId: '1'
          }
        }),

        // Week 4 tasks
        prisma.task.create({
          data: {
            title: 'Beta Release Preparation',
            description: 'Prepare for beta testing with selected users',
            projectId: project.id,
            assignedTo: project.ownerId,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 21 * 24 * 60 * 60 * 1000),
            estimatedHours: 16,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Documentation & Training Materials',
            description: 'Create user manuals and training content',
            projectId: project.id,
            assignedTo: students[0].id,
            assignedBy: project.ownerId,
            priority: 'MEDIUM',
            dueDate: new Date(weekLater.getTime() + 21 * 24 * 60 * 60 * 1000),
            estimatedHours: 12,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Marketing & Launch Planning',
            description: 'Plan marketing strategy and launch campaign',
            projectId: project.id,
            assignedTo: employers[0].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 21 * 24 * 60 * 60 * 1000),
            estimatedHours: 8,
            status: 'TODO',
            currentStepId: '1'
          }
        }),

        // Week 5 tasks
        prisma.task.create({
          data: {
            title: 'Official Public Launch',
            description: 'Launch the platform to the public',
            projectId: project.id,
            assignedTo: employers[0].id,
            assignedBy: project.ownerId,
            priority: 'CRITICAL',
            dueDate: new Date(weekLater.getTime() + 28 * 24 * 60 * 60 * 1000),
            estimatedHours: 4,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Post-Launch Monitoring',
            description: 'Monitor system performance and user feedback',
            projectId: project.id,
            assignedTo: students[0].id,
            assignedBy: project.ownerId,
            priority: 'HIGH',
            dueDate: new Date(weekLater.getTime() + 28 * 24 * 60 * 60 * 1000),
            estimatedHours: 12,
            status: 'TODO',
            currentStepId: '1'
          }
        }),
        prisma.task.create({
          data: {
            title: 'Performance Optimization',
            description: 'Optimize based on user feedback and analytics',
            projectId: project.id,
            assignedTo: students[1].id,
            assignedBy: project.ownerId,
            priority: 'MEDIUM',
            dueDate: new Date(weekLater.getTime() + 28 * 24 * 60 * 60 * 1000),
            estimatedHours: 16,
            status: 'TODO',
            currentStepId: '1'
          }
        })
      ])
      allTasks.push(...tasks)
    }
    console.log('✅ Created', allTasks.length, 'tasks')

    // Create vacancies for each project
    console.log('💼 Creating vacancies for each project...')
    const allVacancies = []

    for (const project of projects) {
      const vacancies = await Promise.all([
        prisma.vacancy.create({
          data: {
            projectId: project.id,
            title: project.name + ' - Lead Developer',
            description: 'Senior developer role with experience in ' + (project.category || 'General') + '. Requires strong technical skills and problem-solving abilities.',
            type: 'FULL_TIME',
            skills: 'Technical Skills, Problem Solving, Leadership, Communication',
            slots: 2,
            filled: 0,
            status: 'OPEN'
          }
        }),
        prisma.vacancy.create({
          data: {
            projectId: project.id,
            title: project.name + ' - UI/UX Designer',
            description: 'Create beautiful and intuitive user interfaces. Experience with design systems and accessibility standards required.',
            type: 'FULL_TIME',
            skills: 'UI/UX Design, Figma, Prototyping, User Research, Accessibility',
            slots: 1,
            filled: 0,
            status: 'OPEN'
          }
        }),
        prisma.vacancy.create({
          data: {
            projectId: project.id,
            title: project.name + ' - Backend Engineer',
            description: 'Build robust and scalable backend systems. Experience with Node.js, databases, APIs, and cloud services.',
            type: 'FULL_TIME',
            skills: 'Node.js, TypeScript, PostgreSQL, REST APIs, Docker, AWS/GCP',
            slots: 3,
            filled: 1,
            status: 'OPEN'
          }
        }),
        prisma.vacancy.create({
          data: {
            projectId: project.id,
            title: project.name + ' - Project Manager',
            description: 'Lead cross-functional team and manage project timeline, deliverables, and stakeholder communications.',
            type: 'FULL_TIME',
            skills: 'Project Management, Agile, Scrum, Communication, Leadership',
            slots: 1,
            filled: 1,
            status: 'FILLED'
          }
        })
      ])
      allVacancies.push(...vacancies)
    }
    console.log('✅ Created', allVacancies.length, 'vacancies')

    // === NEW: CREATE JOBS WITH PENDING APPROVAL STATUS ===
    console.log('💼 Creating jobs with PENDING approval status...')

    const jobDescriptions = [
      {
        title: 'Senior Software Engineer',
        company: 'Global Trade Hub Limited',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh (Hybrid)',
        salaryRange: '$50,000 - $80,000/year',
        employmentType: 'PERMANENT',
        experience: '5+ years',
        requirements: 'Experience with international trade documentation, customs regulations, and supply chain systems. Strong problem-solving skills and knowledge of trade finance.',
        responsibilities: 'Design and implement software solutions, collaborate with international clients, maintain documentation, participate in technical discussions.',
        benefits: 'Competitive salary, health insurance, paid leave, performance bonuses, professional development'
      },
      {
        title: 'Senior Frontend Developer',
        company: 'Global Trade Hub Limited',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh (On-site)',
        salaryRange: '$40,000 - $65,000/year',
        employmentType: 'PERMANENT',
        experience: '3+ years',
        requirements: 'Proficient in React, Vue.js, TypeScript, and modern CSS. Experience with responsive design and performance optimization.',
        responsibilities: 'Build user interfaces, implement designs, optimize performance, collaborate with backend team, ensure cross-browser compatibility.',
        benefits: 'Competitive salary, health insurance, flexible hours, remote work option, growth opportunities'
      },
      {
        title: 'HR Manager',
        company: 'RecruitPro Professional Services',
        type: 'FULL_TIME',
        location: 'Chittagong, Bangladesh',
        salaryRange: '$30,000 - $50,000/year',
        employmentType: 'PERMANENT',
        experience: '3+ years',
        requirements: 'Experience in full-cycle recruitment including sourcing, screening, interviewing, and onboarding. Strong interpersonal and communication skills.',
        responsibilities: 'Source and screen candidates, conduct interviews, manage offer process, maintain candidate relationships.',
        benefits: 'Performance bonuses, career growth opportunities, professional development, paid holidays'
      },
      {
        title: 'Business Analyst',
        company: 'VirtualSol Solutions Ltd',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh (Remote)',
        salaryRange: '$25,000 - $40,000/year',
        employmentType: 'FULL_TIME',
        experience: '2+ years',
        requirements: 'Strong analytical skills, experience with business intelligence tools, data visualization, and report writing. Excel and PowerPoint expertise required.',
        responsibilities: 'Analyze business processes, create reports, provide insights, present findings to stakeholders.',
        benefits: 'Flexible work hours, health insurance, learning budget, remote work'
      },
      {
        title: 'Educational Counselor',
        company: 'Study Abroad Consulting Group',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh',
        salaryRange: '$25,000 - $40,000/year',
        employmentType: 'PERMANENT',
        experience: '2+ years',
        requirements: 'Experience in education counseling, knowledge of international universities, visa requirements, and study abroad processes. Empathy and patience required.',
        responsibilities: 'Counsel students on university applications, assist with document preparation, guide visa process, maintain student records.',
        benefits: 'Making education accessible, career growth, rewarding work, professional development'
      },
      {
        title: 'Supply Chain Manager',
        company: 'Textiles and Garments Ltd',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh (On-site with travel)',
        salaryRange: '$35,000 - $55,000/year',
        employmentType: 'PERMANENT',
        experience: '5+ years',
        requirements: 'Experience in textile industry, knowledge of trade regulations, logistics management, and international shipping procedures.',
        responsibilities: 'Manage supplier relationships, oversee shipping logistics, ensure compliance, negotiate contracts, track inventory.',
        benefits: 'Travel opportunities, performance bonuses, health insurance, career advancement'
      },
      {
        title: 'Full Stack Developer',
        company: 'Study Abroad Consulting Group',
        type: 'CONTRACT',
        location: 'Remote',
        salaryRange: '$60 - $100/hour',
        employmentType: 'CONTRACT',
        experience: '3+ years',
        requirements: 'Proficient in MERN stack, experience building education platforms, knowledge of education technology, understanding student needs.',
        responsibilities: 'Develop course content, implement learning management features, optimize performance, ensure accessibility.',
        benefits: 'Flexible schedule, diverse projects, competitive pay, remote work'
      },
      {
        title: 'Data Analyst',
        company: 'Global Trade Hub Limited',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh (Hybrid)',
        salaryRange: '$45,000 - $70,000/year',
        employmentType: 'PERMANENT',
        experience: '3+ years',
        requirements: 'Strong SQL knowledge, experience with data visualization tools (Tableau, Power BI), analytical mindset, business intelligence.',
        responsibilities: 'Analyze trade data, create dashboards, generate reports, provide business insights.',
        benefits: 'Performance bonuses, professional growth, data science tools, health insurance'
      },
      {
        title: 'Marketing Coordinator',
        company: 'Global Trade Hub Limited',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh',
        salaryRange: '$35,000 - $50,000/year',
        employmentType: 'PERMANENT',
        experience: '2+ years',
        requirements: 'Experience in digital marketing, content creation, social media management, campaign coordination.',
        responsibilities: 'Execute marketing campaigns, create content, manage social media, track metrics, generate leads.',
        benefits: 'Creative freedom, growth opportunities, team environment, bonus structure'
      },
      {
        title: 'Customer Support Specialist',
        company: 'VirtualSol Solutions Ltd',
        type: 'FULL_TIME',
        location: 'Remote (Philippine time zone)',
        salaryRange: '$18,000 - $28,000/year',
        employmentType: 'FULL_TIME',
        experience: '1+ years',
        requirements: 'Strong English communication, patience, problem-solving, customer service experience, familiarity with support tools.',
        responsibilities: 'Handle customer inquiries, resolve issues, maintain satisfaction, document interactions.',
        benefits: 'Health insurance, paid training, remote work, night shift differential pay'
      },
      {
        title: 'Business Development Associate',
        company: 'RecruitPro Professional Services',
        type: 'FULL_TIME',
        location: 'Chittagong, Bangladesh',
        salaryRange: '$28,000 - $42,000/year',
        employmentType: 'PERMANENT',
        experience: '1-2 years',
        requirements: 'Strong interpersonal skills, sales experience, ability to build relationships, self-motivated.',
        responsibilities: 'Identify and contact potential clients, schedule meetings, present services, close deals.',
        benefits: 'Commission-based earnings, career growth, training programs'
      },
      {
        title: 'Quality Assurance Engineer',
        company: 'Textiles and Garments Ltd',
        type: 'FULL_TIME',
        location: 'Dhaka, Bangladesh',
        salaryRange: '$40,000 - $60,000/year',
        employmentType: 'PERMANENT',
        experience: '4+ years',
        requirements: 'Experience in quality assurance, knowledge of ISO standards, textile industry knowledge, attention to detail.',
        responsibilities: 'Create test plans, execute tests, document issues, coordinate with teams.',
        benefits: 'Quality management, career advancement, skill development'
      },
      {
        title: 'Research Analyst',
        company: 'Study Abroad Consulting Group',
        type: 'PART_TIME',
        location: 'Dhaka, Bangladesh',
        salaryRange: '$15 - $25/hour',
        employmentType: 'PART_TIME',
        experience: '1+ years',
        requirements: 'Research skills, academic writing, data analysis, English proficiency, critical thinking.',
        responsibilities: 'Conduct research, compile reports, analyze data, present findings.',
        benefits: 'Flexible hours, research experience, academic growth'
      }
    ]

    const jobs = []
    for (const jobDesc of jobDescriptions) {
      // Find matching business
      let business
      if (jobDesc.company === 'Global Trade Hub Limited') {
        business = businesses[0]
      } else if (jobDesc.company === 'RecruitPro Professional Services') {
        business = businesses[1]
      } else if (jobDesc.company === 'VirtualSol Solutions Ltd') {
        business = businesses[2]
      } else if (jobDesc.company === 'Study Abroad Consulting Group') {
        business = businesses[3]
      } else if (jobDesc.company === 'Textiles and Garments Ltd') {
        business = businesses[4]
      } else {
        // Create a generic business for other jobs
        business = await prisma.business.create({
          data: {
            name: jobDesc.company || 'Tech Innovations Ltd',
            description: 'Technology company providing innovative solutions',
            industry: 'Technology',
            website: 'https://techinnovations.com',
            location: 'Dhaka, Bangladesh',
            foundedYear: 2020,
            employees: 10,
            type: 'LIMITED_COMPANY',
            stage: 'STARTUP'
          }
        })
        // Link employer to business
        await prisma.businessMember.create({
          data: {
            businessId: business.id,
            userId: employers.find(e => e.company === jobDesc.company)?.id || employers[0].id,
            role: 'OWNER',
            joinedAt: now
          }
        })
      }

      const job = await prisma.job.create({
        data: {
          title: jobDesc.title,
          description: jobDesc.description,
          location: jobDesc.location,
          salaryRange: jobDesc.salaryRange,
          employmentType: jobDesc.employmentType,
          experience: jobDesc.experience,
          requirements: jobDesc.requirements,
          responsibilities: jobDesc.responsibilities,
          benefits: jobDesc.benefits,
          published: false, // Not published, requires admin approval
          status: 'OPEN',
          type: jobDesc.type,
          businessId: business.id,
          userId: business.userId,
          viewCount: 0,
          applicationCount: 0,
          approvalStatus: 'PENDING', // Requires admin approval before being visible
          rejectionReason: null,
          reviewComments: null,
          submissionDate: now,
          createdAt: now
        }
      })
      jobs.push(job)
    }

    console.log('✅ Created', jobs.length, 'jobs with PENDING approval status')

    // === NEW: CREATE INVESTMENTS ===
    console.log('💰 Creating investments...')

    const investmentDescriptions = [
      {
        projectIndex: 0,
        investorIndex: 0,
        amount: 150000,
        equity: 15,
        terms: '15% equity in exchange for $150,000 funding. Project valued at $1M pre-money. Exit via IPO or acquisition within 3-5 years.',
        sector: 'Technology'
      },
      {
        projectIndex: 0,
        investorIndex: 1,
        amount: 100000,
        equity: 10,
        terms: '10% equity for $100,000. Project already showing traction with $50k MRR. Project valuation post-money: $500k.',
        sector: 'Technology'
      },
      {
        projectIndex: 1,
        investorIndex: 0,
        amount: 200000,
        equity: 12,
        terms: '12% equity for $200,000. AI-powered recruitment platform with 200+ registered users. Growing at 40% MoM.',
        sector: 'Technology'
      },
      {
        projectIndex: 2,
        investorIndex: 1,
        amount: 180000,
        equity: 18,
        terms: '18% equity for $180,000. VA marketplace with 50+ pre-vetted VAs across 4 time zones. Annual revenue $300k.',
        sector: 'Services'
      },
      {
        projectIndex: 3,
        investorIndex: 2,
        amount: 250000,
        equity: 20,
        terms: '20% equity for $250,000. Student career platform with 8,000+ registered students. Monthly active users: 1,500.',
        sector: 'Education'
      },
      {
        projectIndex: 4,
        investorIndex: 3,
        amount: 500000,
        equity: 25,
        terms: '25% equity for $500,000. Blockchain supply chain tracker with pilot customers in 5 countries. Patent pending.',
        sector: 'Technology'
      }
    ]

    for (const invDesc of investmentDescriptions) {
      const investment = await prisma.investment.create({
        data: {
          projectId: projects[invDesc.projectIndex].id,
          userId: investors[invDesc.investorIndex].id,
          amount: invDesc.amount,
          equity: invDesc.equity,
          terms: invDesc.terms,
          sector: invDesc.sector,
          status: 'ACTIVE',
          type: 'EQUITY',
          notes: `${investors[invDesc.investorIndex].name} investing in ${projects[invDesc.projectIndex].name}`,
          fundingStage: 'SERIES_A',
          dueDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        }
      })

      // Create notification for project owner
      await prisma.notification.create({
        data: {
          userId: projects[invDesc.projectIndex].ownerId,
          type: 'INVESTMENT',
          title: '💰 Investment Received!',
          message: `${investors[invDesc.investorIndex].name} has expressed interest in your project "${projects[invDesc.projectIndex].name}".`,
          link: `/projects/${projects[invDesc.projectIndex].id}/investment`,
        }
      })

      // Create notification for investor
      await prisma.notification.create({
        data: {
          userId: investors[invDesc.investorIndex].id,
          type: 'INVESTMENT',
          title: '💰 Investment Offer Sent',
          message: `Your investment of $${invDesc.amount.toLocaleString()} in ${projects[invDesc.projectIndex].name} (${invDesc.equity}% equity) has been sent for review.`,
          link: `/projects/${projects[invDesc.projectIndex].id}/investment`
        }
      })
    }

    console.log('✅ Created', investmentDescriptions.length, 'investments')

    // === NEW: CREATE JOB APPLICATIONS ===
    console.log('📋 Creating job applications...')

    // Randomly apply to jobs
    for (let i = 0; i < Math.min(jobs.length, students.length * 2); i++) {
      const job = jobs[i % jobs.length]
      const student = students[i % students.length]

      await prisma.jobApplication.create({
        data: {
          jobId: job.id,
          userId: student.id,
          status: 'UNDER_REVIEW',
          coverLetter: `I am excited to apply for the ${job.title} position at ${job.company.name}. With my background in ${student.major} at ${student.university?.name || 'my university'}, I believe I can contribute effectively to your team. I have experience in ${job.experience.split(',')[0]. Looking forward to discussing how I can add value to ${job.company.name}.`,
          resume: `Resume of ${student.name}.pdf`,
          skills: job.skills.split(', ').map(s => s.trim()),
          education: student.major + ' at ' + (student.university?.name || 'University'),
          experience: job.experience,
        }
      })

      // Increment application count
      await prisma.job.update({
        where: { id: job.id },
        data: {
          applicationCount: { increment: 1 }
        }
      })
    }

    console.log('✅ Created job applications:', Math.min(jobs.length, students.length * 2))

    // === NEW: CREATE NOTIFICATIONS FOR APPROVALS ===
    console.log('🔔 Creating notifications for approvals...')

    // Notifications for project owners about projects needing approval
    for (const project of projects) {
      await prisma.notification.create({
        data: {
          userId: project.ownerId,
          type: 'PROJECT_APPROVAL',
          title: '🎯 Project Submitted for Approval',
          message: `Your project "${project.name}" has been submitted for admin review and is currently pending approval. You will be notified of the decision.`,
          link: `/admin/approvals/projects/${project.id}`
        }
      })

      // Notifications for team members
      const projectMembers = await prisma.projectMember.findMany({
        where: { projectId: project.id }
      })

      for (const member of projectMembers) {
        if (member.userId !== project.ownerId) {
          await prisma.notification.create({
            data: {
              userId: member.userId,
              type: 'PROJECT_UPDATE',
              title: '📝 Project Submitted for Approval',
              message: `A project you're a member of ("${project.name}") has been submitted for admin approval.`,
              link: `/projects/${project.id}`
            }
          })
        }
      }
    }

    // Notifications for job posters about jobs needing approval
    for (const job of jobs) {
      await prisma.notification.create({
        data: {
          userId: job.userId,
          type: 'JOB_APPROVAL',
          title: '🎯 Job Posted for Approval',
          message: `Your job "${job.title}" at ${job.company.name} has been submitted for admin review and is currently pending approval.`,
          link: `/admin/approvals/jobs/${job.id}`
        }
      })

      // Create notifications for job applicants
      const jobApplications = await prisma.jobApplication.findMany({
        where: { jobId: job.id }
      })

      for (const application of jobApplications) {
        await prisma.notification.create({
          data: {
            userId: application.userId,
            type: 'JOB_APPLICATION',
            title: '📝 Application Status Update',
            message: `Your application for "${job.title}" is being reviewed by ${job.company.name}.`,
            link: `/jobs/${job.id}`
          }
        })
      }
    }

    console.log('✅ Created approval notifications')

    // === NEW: CREATE TASK COMMENTS ===
    console.log('💬 Creating task comments...')
    const taskComment1 = await prisma.taskComment.create({
      data: {
        taskId: allTasks[0].id,
        userId: students[0].id,
        content: 'This is the initial requirements analysis for the trade facilitation platform. We need to identify all trade documentation requirements and compliance checkpoints.',
        createdAt: now
      }
    })

    const taskComment2 = await prisma.taskComment.create({
      data: {
        taskId: allTasks[1].id,
        userId: students[1].id,
        content: 'Consider using GraphQL for real-time data synchronization across multiple international users.',
        createdAt: now
      }
    })

    console.log('✅ Created 2 task comments')

    // === NEW: CREATE PERSONAL TASKS FOR STUDENTS ===
    console.log('👤 Creating personal tasks for students...')
    for (const student of students.slice(0, 5)) {
      await prisma.personalTask.create({
        data: {
          userId: student.id,
          title: 'Update Portfolio',
          description: 'Add recent projects, skills, and achievements to your portfolio.',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: nextWeek
        }
      })

      await prisma.personalTask.create({
        data: {
          userId: student.id,
          title: 'Apply for Internship',
          description: 'Apply for relevant internships with companies in your field.',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: nextWeek
        }
      })

      await prisma.personalTask.create({
        data: {
          userId: student.id,
          title: 'Update Resume',
          description: 'Refresh your resume with latest projects and skills.',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: tomorrow
        }
      })
    }

    console.log('✅ Created', students.slice(0, 5).length * 3, 'personal tasks')

    // === CREATE RATINGS ===
    console.log('⭐ Creating ratings...')
    const ratings = await Promise.all([
      prisma.rating.create({
        data: {
          fromUserId: students[0].id,
          toUserId: students[0].id,
          rating: 5,
          feedback: 'Excellent work on the requirements analysis task. Very thorough and detailed.',
          category: 'TASK_PERFORMANCE'
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: project1.ownerId,
          toUserId: students[0].id,
          rating: 4.5,
          feedback: 'Great contribution to the technical architecture design. Clean and maintainable code.',
          category: 'TASK_QUALITY'
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: employers[0].id,
          toUserId: students[0].id,
          rating: 5,
          feedback: 'Outstanding performance on the recruitment project. Very professional approach.',
          category: 'PERFORMANCE'
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[1].id,
          toUserId: students[1].id,
          rating: 4.0,
          feedback: 'Good work on UI development. Consider improving contrast ratios and accessibility.',
          category: 'TASK_QUALITY'
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: project1.ownerId,
          toUserId: students[1].id,
          rating: 4.8,
          feedback: 'Excellent database design and optimization. Queries are fast and efficient.',
          category: 'TASK_QUALITY'
        }
      })
    ])

    console.log('✅ Created', ratings.length, 'ratings')

    // === CREATE AUDIT LOGS ===
    console.log('📋 Creating audit logs...')
    await prisma.auditLog.create({
      data: {
        userId: platformAdmin.id,
        action: 'SEEDING_COMPLETE',
        description: 'Database seeded with comprehensive test data including:',
          + `  ${universities.length} universities`
          + `  ${students.length} students`
          + `  ${employers.length} employers`
          + `  ${investors.length} investors`
          + `  ${projects.length} projects (all PENDING approval)`
          + `  ${jobs.length} jobs (all PENDING approval)`
          + `  ${allTasks.length} tasks`
          + `  ${allVacancies.length} vacancies`
          + `  ${ratings.length} ratings`,
        ipAddress: '127.0.0.1',
        userAgent: 'Seed Script v2.0'
      }
    })

    console.log('✅ Audit log created')

    // === FINAL SUMMARY ===
    console.log('')
    console.log('🎉 Seeding Complete!')
    console.log('')
    console.log('📊 Summary:')
    console.log('   Universities:', universities.length)
    console.log('   Users:', students.length + employers.length + investors.length + 1) // +1 for platform admin
    console.log('      - Platform Admin: 1 (admin@platform.com)')
    console.log('      - Students:', students.length)
    console.log('      - Employers:', employers.length)
    console.log('      - Investors:', investors.length)
    console.log('   Businesses:', businesses.length)
    console.log('   Projects:', projects.length, '(all with PENDING approval status)')
    console.log('   Jobs:', jobs.length, '(all with PENDING approval status)')
    console.log('   Investments:', investmentDescriptions.length)
    console.log('   Vacancies:', allVacancies.length)
    console.log('   Tasks:', allTasks.length)
    console.log('   Ratings:', ratings.length)
    console.log('   Job Applications:', Math.min(jobs.length, students.length * 2))
    console.log('')
    console.log('🔐 Platform Admin Credentials:')
    console.log('   Email: admin@platform.com')
    console.log('   Password: Password123!')
    console.log('   Role: PLATFORM_ADMIN')
    console.log('')
    console.log('📱 Test Data Overview:')
    console.log('   - Projects: ' + projects.map(p => `• ${p.name} (by ${p.owner?.name || 'Unknown'})`).join('\n   '))
    console.log('   - Jobs: ' + jobs.map(j => `• ${j.title} at ${j.business.name} (${j.applicationCount} applications)`).join('\n   '))
    console.log('   - Investments: $' + investmentDescriptions.map(inv => `• $${inv.amount.toLocaleString()} in ${projects[inv.projectIndex].name} (${inv.equity}% equity)`).join('\n   '))
    console.log('')
    console.log('🚀 Next Steps:')
    console.log('1. Log in at http://localhost:3000')
    console.log('2. Go to /admin/approvals/projects to approve projects')
    console.log('3. Go to /admin/approvals/jobs to approve jobs')
    console.log('4. Create new projects (they will show as PENDING and appear in admin)')
    console.log('5. Create new jobs (they will show as PENDING and appear in admin)')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
