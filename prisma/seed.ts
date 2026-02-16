const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { randomUUID } = require('crypto')

const prisma = new PrismaClient()

// Simple ID generator
function generateId() {
  return randomUUID()
}

async function main() {
  console.log('🌱 Starting comprehensive business-focused database seeding...')

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
    await prisma.jobApproval.deleteMany()
    await prisma.verificationRequest.deleteMany()
    await prisma.agreement.deleteMany()
    await prisma.investment.deleteMany()
    await prisma.milestone.deleteMany()
    await prisma.vacancy.deleteMany()
    await prisma.department.deleteMany()
    // Clear new task management models
    await prisma.taskComment.deleteMany()
    await prisma.taskStep.deleteMany()
    await prisma.personalTask.deleteMany()
    await prisma.task.deleteMany()
    await prisma.projectMember.deleteMany()
    await prisma.projectApproval.deleteMany()
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
    await prisma.collaborationRequest.deleteMany()
    await prisma.leaderboard.deleteMany()

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
          id: generateId(),
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
      }),
      prisma.university.create({
        data: {
          name: 'Begum Rokeya University, Rangpur',
          code: 'BRUR001',
          description: 'Public university in Rangpur',
          location: 'Rangpur, Bangladesh',
          website: 'https://www.brur.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4800,
          verificationStatus: 'VERIFIED',
          totalProjects: 36
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University of Professionals',
          code: 'BUP001',
          description: 'Public university for armed forces personnel',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.bup.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Gopalganj Science & Technology University',
          code: 'BSMRSTU001',
          description: 'Science and technology university in Gopalganj',
          location: 'Gopalganj, Bangladesh',
          website: 'https://www.bsmrstu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 17,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University of Textiles',
          code: 'BUTEX001',
          description: 'Textile engineering university',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.butex.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 9,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Barishal',
          code: 'UBAR001',
          description: 'Public university in Barishal',
          location: 'Barishal, Bangladesh',
          website: 'https://www.bu.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rangamati Science and Technology University',
          code: 'RMSTU001',
          description: 'Science and technology university in Rangamati',
          location: 'Rangamati, Bangladesh',
          website: 'https://www.rmstu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Maritime University',
          code: 'BMMAR001',
          description: 'Maritime education and training university',
          location: 'Dhaka, Bangladesh',
          website: 'https://bmu.edu.bd/',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 2500,
          verificationStatus: 'VERIFIED',
          totalProjects: 22
        }
      }),
      prisma.university.create({
        data: {
          name: 'Islamic Arabic University',
          code: 'IAU001',
          description: 'Islamic studies university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.iau.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 8000,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chittagong Medical University',
          code: 'CMU001',
          description: 'Medical university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.cmu.edu.bd',
          rankingScore: 4.5,
          rankingPosition: 7,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rajshahi Medical University',
          code: 'RMUBD001',
          description: 'Medical university in Rajshahi',
          location: 'Rajshahi, Bangladesh',
          website: 'https://www.rmu.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 3200,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rabindra University, Bangladesh',
          code: 'RUB001',
          description: 'Arts and cultural university in Kushtia',
          location: 'Kushtia, Bangladesh',
          website: 'https://www.rub.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Frontier Technology, Bangladesh',
          code: 'UFTB001',
          description: 'Technology university in Rangamati',
          location: 'Rangamati, Bangladesh',
          website: 'https://www.uftb.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 2800,
          verificationStatus: 'VERIFIED',
          totalProjects: 24
        }
      }),
      prisma.university.create({
        data: {
          name: 'Netrokona University',
          code: 'SHU001',
          description: 'Public university in Netrokona',
          location: 'Netrokona, Bangladesh',
          website: 'https://www.shu.edu.bd/',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3200,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khulna Agricultural University',
          code: 'KAU001',
          description: 'Agricultural university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.kau.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Jamalpur Science and Technology University',
          code: 'BSFMSTU001',
          description: 'Science and technology university in Jamalpur',
          location: 'Jamalpur, Bangladesh',
          website: 'https://bsfmstu.ac.bd/',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sylhet Medical University',
          code: 'BSFMMU001',
          description: 'Medical university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.bsfmmu.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 2800,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'Aviation And Aerospace University, Bangladesh',
          code: 'AAUB001',
          description: 'Aviation and aerospace university',
          location: 'Kurmitola, Dhaka, Bangladesh',
          website: 'https://www.aaub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 2500,
          verificationStatus: 'VERIFIED',
          totalProjects: 22
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chandpur Science and Technology University',
          code: 'CSTU001',
          description: 'Science and technology university in Chandpur',
          location: 'Chandpur, Bangladesh',
          website: 'https://www.cstu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 24
        }
      }),
      prisma.university.create({
        data: {
          name: 'Kishoreganj University',
          code: 'BSMRU001',
          description: 'Public university in Kishoreganj',
          location: 'Kishoreganj, Bangladesh',
          website: 'https://bsmru.ac.bd.',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3200,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'Hobiganj Agricultural University',
          code: 'HAUBD001',
          description: 'Agricultural university in Hobiganj',
          location: 'Hobiganj, Bangladesh',
          website: 'https://www.hau.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khulna Medical University',
          code: 'SHMUBD001',
          description: 'Medical university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.shmu.ac.bd',
          rankingScore: 4.4,
          rankingPosition: 7,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 27
        }
      }),
      prisma.university.create({
        data: {
          name: 'Kurigram Agricultural University',
          code: 'KURIAU001',
          description: 'Agricultural university in Kurigram',
          location: 'Kurigram, Bangladesh',
          website: 'https://www.kuriau.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 2800,
          verificationStatus: 'VERIFIED',
          totalProjects: 24
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sunamganj Science and Technology University',
          code: 'SSTUBD001',
          description: 'Science and technology university in Sunamganj',
          location: 'Sunamganj, Bangladesh',
          website: 'https://www.sstu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Pirojpur Science & Technology University',
          code: 'PRSTUBD001',
          description: 'Science and technology university in Pirojpur',
          location: 'Pirojpur, Bangladesh',
          website: 'https://www.prstu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 2800,
          verificationStatus: 'VERIFIED',
          totalProjects: 23
        }
      }),
      prisma.university.create({
        data: {
          name: 'Naogaon University',
          code: 'NAUBD001',
          description: 'Public university in Naogaon',
          location: 'Naogaon, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 24
        }
      }),
      prisma.university.create({
        data: {
          name: 'Meherpur University',
          code: 'MEHUBD001',
          description: 'Public university in Meherpur',
          location: 'Meherpur, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 2800,
          verificationStatus: 'VERIFIED',
          totalProjects: 23
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bogra Science and Technology University',
          code: 'BSTUBD001',
          description: 'Science and technology university in Bogra',
          location: 'Bogra, Bangladesh',
          website: 'https://bstu.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),

      // === PRIVATE UNIVERSITIES ===
      prisma.university.create({
        data: {
          name: 'North South University',
          code: 'NSU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.northsouth.edu',
          rankingScore: 4.7,
          rankingPosition: 2,
          totalStudents: 15000,
          verificationStatus: 'VERIFIED',
          totalProjects: 95
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Science & Technology Chittagong',
          code: 'USTC001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.ustc.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 8000,
          verificationStatus: 'VERIFIED',
          totalProjects: 52
        }
      }),
      prisma.university.create({
        data: {
          name: 'Independent University, Bangladesh',
          code: 'IUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.iub.edu.bd',
          rankingScore: 4.6,
          rankingPosition: 4,
          totalStudents: 12000,
          verificationStatus: 'VERIFIED',
          totalProjects: 78
        }
      }),
      prisma.university.create({
        data: {
          name: "Central Women's University",
          code: 'CWU001',
          description: "Women's university in Dhaka",
          location: 'Dhaka, Bangladesh',
          website: 'https://www.cwu.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'International University of Business Agriculture & Technology',
          code: 'IUBAT001',
          description: 'Private university in Dhaka',
          location: 'Uttara, Dhaka, Bangladesh',
          website: 'https://www.iubat.edu',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 8500,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'International Islamic University Chittagong',
          code: 'IIUC001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.iiuc.ac.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 10000,
          verificationStatus: 'VERIFIED',
          totalProjects: 55
        }
      }),
      prisma.university.create({
        data: {
          name: "Ahsanullah University of Science and Technology",
          code: 'AUST001',
          description: 'Private engineering university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.aust.edu',
          rankingScore: 4.4,
          rankingPosition: 6,
          totalStudents: 8000,
          verificationStatus: 'VERIFIED',
          totalProjects: 62
        }
      }),
      prisma.university.create({
        data: {
          name: 'American International University-Bangladesh',
          code: 'AIUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.aiub.ac.bd',
          rankingScore: 4.5,
          rankingPosition: 5,
          totalStudents: 18000,
          verificationStatus: 'VERIFIED',
          totalProjects: 88
        }
      }),
      prisma.university.create({
        data: {
          name: 'East West University',
          code: 'EWU001',
          description: 'Private university in Dhaka',
          location: 'Aftabnagar, Dhaka, Bangladesh',
          website: 'https://www.ewubd.edu',
          rankingScore: 4.5,
          rankingPosition: 5,
          totalStudents: 12000,
          verificationStatus: 'VERIFIED',
          totalProjects: 75
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Asia Pacific',
          code: 'UAP001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.uap-bd.edu',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 9000,
          verificationStatus: 'VERIFIED',
          totalProjects: 58
        }
      }),
      prisma.university.create({
        data: {
          name: 'Gono Bishwabidyalay',
          code: 'GB001',
          description: 'Private university in Savar',
          location: 'Savar, Dhaka, Bangladesh',
          website: 'https://www.gonouniversity.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: "The People's University of Bangladesh",
          code: 'PUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.pub.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Asian University of Bangladesh',
          code: 'AUBBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.aub.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 40
        }
      }),
      prisma.university.create({
        data: {
          name: 'Dhaka International University',
          code: 'DIU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.diu.ac',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 7500,
          verificationStatus: 'VERIFIED',
          totalProjects: 45
        }
      }),
      prisma.university.create({
        data: {
          name: 'Manarat International University',
          code: 'MIU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.manarat.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'BRAC University',
          code: 'BRACU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.bracu.ac.bd',
          rankingScore: 4.8,
          rankingPosition: 1,
          totalStudents: 16000,
          verificationStatus: 'VERIFIED',
          totalProjects: 102
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University',
          code: 'BUBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.bu.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 7000,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Leading University',
          code: 'LUS001',
          description: 'Private university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.lus.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'BGC Trust University Bangladesh',
          code: 'BGC001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.bgctub.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sylhet International University',
          code: 'SIU001',
          description: 'Private university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.siu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Development Alternative',
          code: 'UODA001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.uoda.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 34
        }
      }),
      prisma.university.create({
        data: {
          name: 'Premier University',
          code: 'PUC001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.puc.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4200,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Southeast University',
          code: 'SEU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.seu.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 11000,
          verificationStatus: 'VERIFIED',
          totalProjects: 62
        }
      }),
      prisma.university.create({
        data: {
          name: 'Daffodil International University',
          code: 'DIUBD001',
          description: 'Private university in Dhamondi, Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.daffodilvarsity.edu.bd',
          rankingScore: 4.5,
          rankingPosition: 5,
          totalStudents: 20000,
          verificationStatus: 'VERIFIED',
          totalProjects: 95
        }
      }),
      prisma.university.create({
        data: {
          name: 'Stamford University Bangladesh',
          code: 'SUBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.stamforduniversity.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 6,
          totalStudents: 14000,
          verificationStatus: 'VERIFIED',
          totalProjects: 72
        }
      }),
      prisma.university.create({
        data: {
          name: 'State University of Bangladesh',
          code: 'SUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.sub.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'City University',
          code: 'CITY001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.cityuniversity.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 8000,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'Prime University',
          code: 'PRIME001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.primeuniversity.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Northern University Bangladesh',
          code: 'NUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.nub.ac.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 7500,
          verificationStatus: 'VERIFIED',
          totalProjects: 45
        }
      }),
      prisma.university.create({
        data: {
          name: 'Southern University Bangladesh',
          code: 'SOUTHBD001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.southern.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 8500,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'Green University of Bangladesh',
          code: 'GREEN001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.green.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 7000,
          verificationStatus: 'VERIFIED',
          totalProjects: 45
        }
      }),
      prisma.university.create({
        data: {
          name: 'Pundra University of Science & Technology',
          code: 'PUSTBD001',
          description: 'Private university in Bogra',
          location: 'Bogra, Bangladesh',
          website: 'https://www.pundrauniversity.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'World University of Bangladesh',
          code: 'WUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.wub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 36
        }
      }),
      prisma.university.create({
        data: {
          name: 'Shanto-Mariam University of Creative Technology',
          code: 'SMUCT001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.smuct.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'The Millennium University',
          code: 'TMU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.themillenniumuniversity.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 34
        }
      }),
      prisma.university.create({
        data: {
          name: 'Eastern University',
          code: 'EU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.easternuni.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Metropolitan University',
          code: 'METRO001',
          description: 'Private university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.metrouni.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Uttara University',
          code: 'UTTARA001',
          description: 'Private university in Uttara, Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.uttarauniversity.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 9500,
          verificationStatus: 'VERIFIED',
          totalProjects: 55
        }
      }),
      prisma.university.create({
        data: {
          name: 'United International University',
          code: 'UIU001',
          description: 'Private university in Dhaka',
          location: 'United City, Dhaka, Bangladesh',
          website: 'https://www.uiu.ac.bd',
          rankingScore: 4.5,
          rankingPosition: 5,
          totalStudents: 13000,
          verificationStatus: 'VERIFIED',
          totalProjects: 78
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of South Asia',
          code: 'USA001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.southasiauni.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Victoria University of Bangladesh',
          code: 'VUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.vub.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University of Business & Technology',
          code: 'BUBT001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.bubt.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 7500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Presidency University',
          code: 'PRES001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.presidency.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Information Technology & Sciences',
          code: 'UITS001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.uits.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 36
        }
      }),
      prisma.university.create({
        data: {
          name: 'Primeasia University',
          code: 'PRIMEASIA001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.primeasia.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Royal University of Dhaka',
          code: 'RUD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.royal.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Liberal Arts Bangladesh',
          code: 'ULAB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.ulab.edu.bd',
          rankingScore: 4.4,
          rankingPosition: 6,
          totalStudents: 7000,
          verificationStatus: 'VERIFIED',
          totalProjects: 52
        }
      }),
      prisma.university.create({
        data: {
          name: 'Atish Dipankar University of Science & Technology',
          code: 'ADUST001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.adust.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Islami University',
          code: 'BIUBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.biu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'ASA University Bangladesh',
          code: 'ASAUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.asaub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5500,
          verificationStatus: 'VERIFIED',
          totalProjects: 36
        }
      }),
      prisma.university.create({
        data: {
          name: 'East Delta University',
          code: 'EDU001',
          description: 'Private university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.eastdelta.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'European University of Bangladesh',
          code: 'EUB001',
          description: 'Private university in Dhaka',
          location: 'Gazipur, Bangladesh',
          website: 'https://www.eub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Varendra University',
          code: 'VU001',
          description: 'Private university in Rajshahi',
          location: 'Rajshahi, Bangladesh',
          website: 'https://www.vu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Hamdard University Bangladesh',
          code: 'HAMD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.hamdarduniversity.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 40
        }
      }),
      prisma.university.create({
        data: {
          name: 'BGMEA University of Fashion & Technology',
          code: 'BUFT001',
          description: 'Fashion and technology university',
          location: 'Uttara, Dhaka, Bangladesh',
          website: 'https://www.buft.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 7000,
          verificationStatus: 'VERIFIED',
          totalProjects: 48
        }
      }),
      prisma.university.create({
        data: {
          name: 'North East University Bangladesh',
          code: 'NEUB001',
          description: 'Private university in Sylhet',
          location: 'Sylhet, Bangladesh',
          website: 'https://www.neub.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'First Capital University of Bangladesh',
          code: 'FCUB001',
          description: 'Private university in Mymensingh',
          location: 'Mymensingh, Bangladesh',
          website: 'https://www.fcub.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Ishakha International University, Bangladesh',
          code: 'ISHAKHA001',
          description: 'Private university in Bhedergonj',
          location: 'Narsingdi, Bangladesh',
          website: 'https://www.ishakha.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Z.H Sikder University of Science & Technology',
          code: 'ZHSUST001',
          description: 'Private university in Madhabdi',
          location: 'Narsingdi, Bangladesh',
          website: 'https://www.zhsust.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Exim Bank Agricultural University, Bangladesh',
          code: 'EBAUB001',
          description: 'Agricultural university in Chapainawabganj',
          location: 'Chapainawabganj, Bangladesh',
          website: 'https://www.ebaub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'North Western University',
          code: 'NWU001',
          description: 'Private university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.nwu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khwaja Yunus Ali University',
          code: 'KYAU001',
          description: 'Private university in Sirajganj',
          location: 'Sirajganj, Bangladesh',
          website: 'https://www.kyau.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'Sonargaon University',
          code: 'SUBD221',
          description: 'Private university in Sonargaon',
          location: 'Narayanganj, Bangladesh',
          website: 'https://www.su.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Feni University',
          code: 'FENI001',
          description: 'Private university in Feni',
          location: 'Feni, Bangladesh',
          website: 'https://www.feniuniversity.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3800,
          verificationStatus: 'VERIFIED',
          totalProjects: 26
        }
      }),
      prisma.university.create({
        data: {
          name: 'Britannia University',
          code: 'BRIT001',
          description: 'Private university in Comilla',
          location: 'Comilla, Bangladesh',
          website: 'https://www.britannia.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Port City International University',
          code: 'PCIU001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.portcity.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh University of Health Sciences',
          code: 'BUHS001',
          description: 'Health sciences university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.buhs.ac.bd',
          rankingScore: 4.4,
          rankingPosition: 6,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chittagong Independent University',
          code: 'CIU001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.ciu.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Notre Dame University Bangladesh',
          code: 'NDUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.ndub.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 40
        }
      }),
      prisma.university.create({
        data: {
          name: 'Times University, Bangladesh',
          code: 'TIMES001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'http://www.timesuniversitybd.com',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'North Bengal International University',
          code: 'NBIU001',
          description: 'Private university in Rangpur',
          location: 'Rangpur, Bangladesh',
          website: 'https://www.nbiu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Fareast International University',
          code: 'FIU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.fiu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rajshahi Science & Technology University',
          code: 'RSTU001',
          description: 'Public university in Natore',
          location: 'Natore, Bangladesh',
          website: 'https://www.rstu.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 4200,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Brahmaputra International University',
          code: 'BIU2001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.sfmu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: "Cox's Bazar International University",
          code: 'CBIU001',
          description: 'Private university in Cox Bazar',
          location: 'Cox Bazar, Bangladesh',
          website: 'https://www.cbiu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'R. P. Shaha University',
          code: 'RPSU001',
          description: 'Private university in Narayanganj',
          location: 'Narayanganj, Bangladesh',
          website: 'https://www.rpsu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'German University Bangladesh',
          code: 'GUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.gub.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Global University Bangladesh',
          code: 'GUBBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.globaluniversity.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'CCN University of Science & Technology',
          code: 'CCN001',
          description: 'Private university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.ccnust.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Army University of Science and Technology',
          code: 'BAUST001',
          description: 'Army university in Saidpur',
          location: 'Saidpur, Bangladesh',
          website: 'https://www.baust.edu.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 35
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Army University of Engineering and Technology',
          code: 'BAUET001',
          description: 'Army engineering university in Qadirabad',
          location: 'Qadirabad, Natore, Bangladesh',
          website: 'https://www.bauet.ac.bd',
          rankingScore: 4.3,
          rankingPosition: 8,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Army International University of Science & Technology',
          code: 'BAIUST001',
          description: 'Army university in Comilla',
          location: 'Comilla, Bangladesh',
          website: 'https://www.baiust.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Scholars',
          code: 'US001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.ius.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Canadian University of Bangladesh',
          code: 'CUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.cub.edu.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 6500,
          verificationStatus: 'VERIFIED',
          totalProjects: 42
        }
      }),
      prisma.university.create({
        data: {
          name: 'N.P.I University of Bangladesh',
          code: 'NPIUB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.npiub.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Northern University of Business & Technology, Khulna',
          code: 'NUBTK001',
          description: 'Private university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.nubtkhulna.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rabindra Maitree University',
          code: 'RMUKUS001',
          description: 'Private university in Kushtia',
          location: 'Kushtia, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Creative Technology, Chittagong',
          code: 'UCTC001',
          description: 'Private university in Chittagong',
          location: 'Chittagong, Bangladesh',
          website: 'https://www.uctc.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Central University of Science and Technology',
          code: 'CUST001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.cust.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 6000,
          verificationStatus: 'VERIFIED',
          totalProjects: 38
        }
      }),
      prisma.university.create({
        data: {
          name: 'Tagore University of Creative Arts',
          code: 'TUCA001',
          description: 'Arts university in Uttara, Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.tuca.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Global Village',
          code: 'UGV001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.ugv.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Rupayan A.K.M Shamsuzzoha University',
          code: 'RAKMS001',
          description: 'Private university in Gopalganj',
          location: 'Gopalganj, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3000,
          verificationStatus: 'VERIFIED',
          totalProjects: 22
        }
      }),
      prisma.university.create({
        data: {
          name: 'Anwer Khan Modern University',
          code: 'AKMU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.akmu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'ZNRF University of Management Sciences',
          code: 'ZUMS001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.zums.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Ahsania Mission University of Science and Technology',
          code: 'AMUST001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.amust.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Khulna Khan Bahadur Ahsanullah University',
          code: 'KKBUBD001',
          description: 'Private university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.kkbau.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bandarban University',
          code: 'BUBBD001',
          description: 'Private university in Bandarban',
          location: 'Bandarban, Bangladesh',
          website: 'https://www.bubban.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Shah Makhdum Management University',
          code: 'SMMU001',
          description: 'Private university in Rajshahi',
          location: 'Rajshahi, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Trust University, Barishal',
          code: 'TRUST001',
          description: 'Private university in Barishal',
          location: 'Barishal, Bangladesh',
          website: 'https://www.trustuniversity.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'International Standard University',
          code: 'ISU001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.isu.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Brahmanbaria',
          code: 'UOBBD001',
          description: 'Private university in Brahmanbaria',
          location: 'Brahmanbaria, Bangladesh',
          website: 'https://www.uob.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'University of Skill Enrichment and Technology',
          code: 'USET001',
          description: 'Private university in Narsingdi',
          location: 'Narsingdi, Bangladesh',
          website: 'https://www.uset.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Microland University of Science and Technology',
          code: 'MUSTBD001',
          description: 'Private university in Tangail',
          location: 'Tangail, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'R.T.M Al-Kabir Technical University',
          code: 'RTM001',
          description: 'Technical university in Tangail',
          location: 'Tangail, Bangladesh',
          website: 'https://www.rtm-aktu.edu.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Dr. Momtaz Begum University of Science and Technology',
          code: 'MUST001',
          description: 'Private university in Rangpur',
          location: 'Rangpur, Bangladesh',
          website: 'https://www.must.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Chattogram BGMEA University of Fashion and Technology',
          code: 'CBUFT001',
          description: 'Fashion and technology university',
          location: 'Chattogram, Bangladesh',
          website: 'https://www.cbuft.edu.bd',
          rankingScore: 4.1,
          rankingPosition: 14,
          totalStudents: 5000,
          verificationStatus: 'VERIFIED',
          totalProjects: 32
        }
      }),
      prisma.university.create({
        data: {
          name: 'Bangladesh Army University of Science and Technology, Khulna',
          code: 'BAUSTK001',
          description: 'Army university in Khulna',
          location: 'Khulna, Bangladesh',
          website: 'https://www.baustkhulna.ac.bd',
          rankingScore: 4.2,
          rankingPosition: 11,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 30
        }
      }),
      prisma.university.create({
        data: {
          name: 'Teesta University, Rangpur',
          code: 'TEESTA001',
          description: 'Private university in Rangpur',
          location: 'Rangpur, Bangladesh',
          website: 'https://www.teestauniversity.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'International Islami University of Science and Technology Bangladesh',
          code: 'IIUSTB001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: 'https://www.iiustb.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'Lalon University of Science and Arts',
          code: 'LUSA001',
          description: 'Private university in Kushtia',
          location: 'Kushtia, Bangladesh',
          website: 'https://lusa.ac.bd',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Justice Abu Zafar Siddiquie Science and Technology University',
          code: 'JAZ001',
          description: 'Public university in Kushtia',
          location: 'Kushtia, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Grameen University',
          code: 'GRAMEEN001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'IBAIS University',
          code: 'IBAIS001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'The University of Comilla',
          code: 'UCOM001',
          description: 'Private university in Comilla',
          location: 'Comilla, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
      prisma.university.create({
        data: {
          name: 'Queens University',
          code: 'QUEENS001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 4000,
          verificationStatus: 'VERIFIED',
          totalProjects: 28
        }
      }),
      prisma.university.create({
        data: {
          name: 'America Bangladesh University',
          code: 'AMERBD001',
          description: 'Private university in Dhaka',
          location: 'Dhaka, Bangladesh',
          website: '',
          rankingScore: 4.0,
          rankingPosition: 18,
          totalStudents: 3500,
          verificationStatus: 'VERIFIED',
          totalProjects: 25
        }
      }),
    ])

    console.log('✅ Created', universities.length, 'universities')

    console.log('👥 Creating users...')
    // Create Students with business-focused majors
    const students = await Promise.all([
      prisma.user.create({
        data: {
          email: 'alex.stanford@edu.com',
          password: hashedPassword,
          name: 'Alex Thompson',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[0].id,
          major: 'Business Administration',
          graduationYear: 2025,
          bio: 'Business major specializing in supply chain management and risk assessment. Passionate about building compliant business operations.',
          location: 'Stanford, CA',
          linkedinUrl: 'https://linkedin.com/in/alexthompson',
          portfolioUrl: 'https://alexthompson.business',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.3,
          collaborationScore: 4.5,
          leadershipScore: 4.0,
          ethicsScore: 4.7,
          reliabilityScore: 4.4,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 450
        }
      }),
      prisma.user.create({
        data: {
          email: 'emily.mit@edu.com',
          password: hashedPassword,
          name: 'Emily Chen',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[1].id,
          major: 'International Business',
          graduationYear: 2026,
          bio: 'International business student with focus on cross-border trade, customs regulations, and global logistics coordination.',
          location: 'Cambridge, MA',
          linkedinUrl: 'https://linkedin.com/in/emilychen',
          portfolioUrl: 'https://emilychen.global',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.6,
          collaborationScore: 4.3,
          leadershipScore: 4.2,
          ethicsScore: 4.8,
          reliabilityScore: 4.5,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 520
        }
      }),
      prisma.user.create({
        data: {
          email: 'marcus.upenn@edu.com',
          password: hashedPassword,
          name: 'Marcus Williams',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[2].id,
          major: 'Human Resources Management',
          graduationYear: 2025,
          bio: 'HR Management specialist with expertise in talent acquisition, candidate screening, and employee relations.',
          location: 'Philadelphia, PA',
          linkedinUrl: 'https://linkedin.com/in/marcuswilliams',
          portfolioUrl: 'https://marcuswilliams.hr',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.4,
          collaborationScore: 4.7,
          leadershipScore: 4.3,
          ethicsScore: 4.6,
          reliabilityScore: 4.5,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 580
        }
      }),
      prisma.user.create({
        data: {
          email: 'sophia.berkeley@edu.com',
          password: hashedPassword,
          name: 'Sophia Martinez',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[3].id,
          major: 'Administrative Management',
          graduationYear: 2026,
          bio: 'Specializing in administrative operations, document management systems, and virtual team coordination.',
          location: 'Berkeley, CA',
          linkedinUrl: 'https://linkedin.com/in/sophiamartinez',
          portfolioUrl: 'https://sophiamartinez.admin',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.4,
          leadershipScore: 4.1,
          ethicsScore: 4.5,
          reliabilityScore: 4.6,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 390
        }
      }),
      prisma.user.create({
        data: {
          email: 'james.nyu@edu.com',
          password: hashedPassword,
          name: 'James Rodriguez',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[4].id,
          major: 'Education & Career Counseling',
          graduationYear: 2025,
          bio: 'Education major focused on international student services, career guidance, and study-abroad program management.',
          location: 'New York, NY',
          linkedinUrl: 'https://linkedin.com/in/jamesrodriguez',
          portfolioUrl: 'https://jamesrodriguez.edu',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.2,
          collaborationScore: 4.6,
          leadershipScore: 4.0,
          ethicsScore: 4.8,
          reliabilityScore: 4.3,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 320
        }
      }),
      prisma.user.create({
        data: {
          email: 'rachel.stanford@edu.com',
          password: hashedPassword,
          name: 'Rachel Kim',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[0].id,
          major: 'Finance & Risk Management',
          graduationYear: 2026,
          bio: 'Finance specialist with expertise in due diligence, financial auditing, and risk assessment processes.',
          location: 'Stanford, CA',
          linkedinUrl: 'https://linkedin.com/in/rachelkim',
          portfolioUrl: 'https://rachelkim.finance',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.7,
          collaborationScore: 4.5,
          leadershipScore: 4.4,
          ethicsScore: 4.9,
          reliabilityScore: 4.6,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 610
        }
      }),
      prisma.user.create({
        data: {
          email: 'david.mit@edu.com',
          password: hashedPassword,
          name: 'David Park',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[1].id,
          major: 'Operations Management',
          graduationYear: 2025,
          bio: 'Operations management student specializing in process optimization, workflow design, and quality assurance.',
          location: 'Cambridge, MA',
          linkedinUrl: 'https://linkedin.com/in/davidpark',
          portfolioUrl: 'https://davidpark.ops',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.4,
          collaborationScore: 4.3,
          leadershipScore: 3.8,
          ethicsScore: 4.5,
          reliabilityScore: 4.4,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 280
        }
      }),
      prisma.user.create({
        data: {
          email: 'lisa.upenn@edu.com',
          password: hashedPassword,
          name: 'Lisa Anderson',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[2].id,
          major: 'Marketing & Communications',
          graduationYear: 2025,
          bio: 'Marketing specialist focused on client relations, business development, and brand management.',
          location: 'Philadelphia, PA',
          linkedinUrl: 'https://linkedin.com/in/lisaanderson',
          portfolioUrl: 'https://lisaanderson.marketing',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.3,
          collaborationScore: 4.8,
          leadershipScore: 4.2,
          ethicsScore: 4.4,
          reliabilityScore: 4.2,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 470
        }
      }),
      prisma.user.create({
        data: {
          email: 'thomas.berkeley@edu.com',
          password: hashedPassword,
          name: 'Thomas Brown',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[3].id,
          major: 'Business Analytics',
          graduationYear: 2026,
          bio: 'Business analytics student with skills in data analysis, process optimization, and performance metrics.',
          location: 'Berkeley, CA',
          linkedinUrl: 'https://linkedin.com/in/thomasbrown',
          portfolioUrl: 'https://thomasbrown.analytics',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.1,
          collaborationScore: 4.4,
          leadershipScore: 3.9,
          ethicsScore: 4.3,
          reliabilityScore: 4.0,
          progressionLevel: 'CONTRIBUTOR',
          totalPoints: 240
        }
      }),
      prisma.user.create({
        data: {
          email: 'natalie.nyu@edu.com',
          password: hashedPassword,
          name: 'Natalie Taylor',
          avatar: null,
          role: 'STUDENT',
          verificationStatus: 'VERIFIED',
          universityId: universities[4].id,
          major: 'Legal Studies',
          graduationYear: 2026,
          bio: 'Legal studies student focused on compliance, regulatory requirements, and contract management.',
          location: 'New York, NY',
          linkedinUrl: 'https://linkedin.com/in/natalietaylor',
          portfolioUrl: 'https://natalietaylor.legal',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.2,
          leadershipScore: 4.1,
          ethicsScore: 4.8,
          reliabilityScore: 4.5,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 360
        }
      })
    ])

    // Employers with business backgrounds
    const employers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.adams@consulting.com',
          password: hashedPassword,
          name: 'John Adams',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'MBA',
          graduationYear: 2018,
          bio: 'Senior Business Consultant with 12 years experience in operational excellence and strategic planning.',
          location: 'New York, NY',
          linkedinUrl: 'https://linkedin.com/in/johnadams',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.8,
          collaborationScore: 4.6,
          leadershipScore: 4.9,
          ethicsScore: 4.8,
          reliabilityScore: 4.7,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 1500
        }
      }),
      prisma.user.create({
        data: {
          email: 'sarah.mitchell@hrfirm.com',
          password: hashedPassword,
          name: 'Sarah Mitchell',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Human Resources Management',
          graduationYear: 2015,
          bio: 'HR Director specializing in talent acquisition and organizational development.',
          location: 'Chicago, IL',
          linkedinUrl: 'https://linkedin.com/in/sarahmitchell',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.9,
          leadershipScore: 4.7,
          ethicsScore: 4.6,
          reliabilityScore: 4.8,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 980
        }
      }),
      prisma.user.create({
        data: {
          email: 'michael.roberts@operations.com',
          password: hashedPassword,
          name: 'Michael Roberts',
          avatar: null,
          role: 'EMPLOYER',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Supply Chain Management',
          graduationYear: 2016,
          bio: 'Operations Manager with expertise in logistics, vendor management, and process improvement.',
          location: 'Atlanta, GA',
          linkedinUrl: 'https://linkedin.com/in/michaelroberts',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.6,
          collaborationScore: 4.4,
          leadershipScore: 4.8,
          ethicsScore: 4.7,
          reliabilityScore: 4.6,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 1100
        }
      })
    ])

    // Investors
    const investors = await Promise.all([
      prisma.user.create({
        data: {
          email: 'richard.anderson@venturefund.com',
          password: hashedPassword,
          name: 'Richard Anderson',
          avatar: null,
          role: 'INVESTOR',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Finance',
          graduationYear: 2010,
          bio: 'Venture capitalist with 15 years experience investing in business services and operations.',
          location: 'New York, NY',
          linkedinUrl: 'https://linkedin.com/in/richardanderson',
          portfolioUrl: 'https://venturefund.com/richard',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.7,
          collaborationScore: 4.5,
          leadershipScore: 4.9,
          ethicsScore: 4.8,
          reliabilityScore: 4.6,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 2100
        }
      }),
      prisma.user.create({
        data: {
          email: 'jennifer.lee@seedfund.com',
          password: hashedPassword,
          name: 'Jennifer Lee',
          avatar: null,
          role: 'INVESTOR',
          verificationStatus: 'VERIFIED',
          universityId: null,
          major: 'Business Administration',
          graduationYear: 2015,
          bio: 'Angel investor focusing on early-stage service businesses and administrative solutions.',
          location: 'Los Angeles, CA',
          linkedinUrl: 'https://linkedin.com/in/jenniferlee',
          portfolioUrl: 'https://seedfund.com/jennifer',
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.4,
          collaborationScore: 4.8,
          leadershipScore: 4.3,
          ethicsScore: 4.9,
          reliabilityScore: 4.5,
          progressionLevel: 'SENIOR_CONTRIBUTOR',
          totalPoints: 950
        }
      })
    ])

    // University Admins
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
          major: 'Business Administration PhD',
          graduationYear: 2010,
          bio: 'Dean of Business School at Stanford, overseeing 60+ student business projects.',
          location: 'Stanford, CA',
          linkedinUrl: 'https://linkedin.com/in/drwilliamfoster',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.6,
          collaborationScore: 4.3,
          leadershipScore: 4.9,
          ethicsScore: 4.9,
          reliabilityScore: 4.8,
          progressionLevel: 'PROJECT_LEAD',
          totalPoints: 2800
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
          major: 'International Business PhD',
          graduationYear: 2012,
          bio: 'Director of International Business Programs at MIT, supporting global business student projects.',
          location: 'Cambridge, MA',
          linkedinUrl: 'https://linkedin.com/in/drpatriciamoore',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.5,
          collaborationScore: 4.4,
          leadershipScore: 4.8,
          ethicsScore: 4.8,
          reliabilityScore: 4.7,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 2400
        }
      }),
      prisma.user.create({
        data: {
          email: 'admin.upenn@upenn.edu',
          password: hashedPassword,
          name: 'Prof. James Wilson',
          avatar: null,
          role: 'UNIVERSITY_ADMIN',
          verificationStatus: 'VERIFIED',
          universityId: universities[2].id,
          major: 'Organizational Psychology',
          graduationYear: 2013,
          bio: 'Director of Student Business Programs at UPenn, mentoring students on business project development.',
          location: 'Philadelphia, PA',
          linkedinUrl: 'https://linkedin.com/in/profjameswilson',
          portfolioUrl: null,
          emailVerified: true,
          emailVerifiedAt: yesterday,
          executionScore: 4.4,
          collaborationScore: 4.6,
          leadershipScore: 4.7,
          ethicsScore: 4.7,
          reliabilityScore: 4.5,
          progressionLevel: 'TEAM_LEAD',
          totalPoints: 2200
        }
      })
    ])

    // Platform Admin
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
        bio: 'Platform administrator managing all operations and user support.',
        location: null,
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
    const businesses = await Promise.all([
      prisma.business.create({
        data: {
          name: 'Consulting Excellence LLC',
          description: 'Professional business consulting firm specializing in operational strategy and process improvement.',
          industry: 'Business Consulting',
          website: 'https://consultingexcellence.com',
          size: '50 employees',
          ownerId: employers[0].id
        }
      }),
      prisma.business.create({
        data: {
          name: 'TalentForce HR Solutions',
          description: 'Full-service HR and recruitment firm providing talent acquisition and organizational development services.',
          industry: 'Human Resources',
          website: 'https://talentforce.com',
          size: '75 employees',
          ownerId: employers[1].id
        }
      }),
      prisma.business.create({
        data: {
          name: 'OptiOps Management',
          description: 'Operations management consulting focused on efficiency, logistics, and supply chain optimization.',
          industry: 'Operations Management',
          website: 'https://optiops.com',
          size: '40 employees',
          ownerId: employers[2].id
        }
      })
    ])

    console.log('✅ Created', businesses.length, 'businesses')

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
          businessId: businesses[1].id,
          userId: employers[1].id,
          role: 'OWNER'
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
          businessId: businesses[0].id,
          userId: students[0].id,
          role: 'PROJECT_MANAGER'
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
          userId: students[6].id,
          role: 'TEAM_LEAD'
        }
      })
    ])

    console.log('✅ Created 6 business members')

    console.log('🎓 Creating business skills...')
    const skillsData = [
      // Alex Thompson - Supply Chain & Risk Management
      ...['Supplier Verification', 'Due Diligence', 'Risk Assessment', 'Compliance Management', 'Supply Chain Operations', 'Quality Assurance', 'Audit Processes', 'Vendor Management', 'Business Analysis', 'Financial Analysis'].map(name => ({
        userId: students[0].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 15) + 8
      })),
      // Emily Chen - International Trade
      ...['International Trade', 'Customs Regulations', 'Cross-Border Logistics', 'Trade Documentation', 'Import/Export Compliance', 'International Shipping', 'Trade Finance', 'Supply Chain Coordination', 'Global Operations', 'Regulatory Affairs'].map(name => ({
        userId: students[1].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 18) + 10
      })),
      // Marcus Williams - HR & Recruitment
      ...['Talent Acquisition', 'Candidate Screening', 'Recruitment Processes', 'Employee Relations', 'Performance Management', 'Onboarding', 'HR Analytics', 'Compensation Planning', 'Training & Development', 'Organizational Development'].map(name => ({
        userId: students[2].id,
        name,
        level: 'EXPERT',
        endorsements: Math.floor(Math.random() * 20) + 12
      })),
      // Sophia Martinez - Administrative Management
      ...['Administrative Operations', 'Document Management', 'Virtual Team Coordination', 'Process Improvement', 'Client Support', 'Scheduling Management', 'Communication Management', 'Office Administration', 'Records Management', 'Workflow Optimization'].map(name => ({
        userId: students[3].id,
        name,
        level: 'INTERMEDIATE',
        endorsements: Math.floor(Math.random() * 12) + 5
      })),
      // James Rodriguez - Education & Career Counseling
      ...['Career Counseling', 'Student Services', 'Educational Consulting', 'Program Management', 'Advising', 'Cross-Cultural Communication', 'Student Success Planning', 'Educational Pathways', 'Mentoring', 'Client Relations'].map(name => ({
        userId: students[4].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 14) + 7
      })),
      // Rachel Kim - Finance & Risk
      ...['Financial Due Diligence', 'Risk Analysis', 'Financial Auditing', 'Compliance Review', 'Investment Assessment', 'Credit Analysis', 'Financial Reporting', 'Budget Management', 'Financial Planning', 'Risk Mitigation'].map(name => ({
        userId: students[5].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 16) + 9
      })),
      // David Park - Operations Management
      ...['Operations Strategy', 'Process Design', 'Quality Control', 'Efficiency Analysis', 'Workflow Optimization', 'Performance Metrics', 'Operations Planning', 'Resource Management', 'Continuous Improvement', 'Lean Management'].map(name => ({
        userId: students[6].id,
        name,
        level: 'INTERMEDIATE',
        endorsements: Math.floor(Math.random() * 11) + 4
      })),
      // Lisa Anderson - Marketing & Business Development
      ...['Business Development', 'Client Relations', 'Marketing Strategy', 'Brand Management', 'Lead Generation', 'Sales Management', 'Partnership Development', 'Client Retention', 'Market Research', 'Proposal Writing'].map(name => ({
        userId: students[7].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 15) + 8
      })),
      // Thomas Brown - Business Analytics
      ...['Data Analysis', 'Business Intelligence', 'Performance Reporting', 'KPI Tracking', 'Process Metrics', 'Statistical Analysis', 'Dashboard Development', 'Trend Analysis', 'Forecasting', 'Business Optimization'].map(name => ({
        userId: students[8].id,
        name,
        level: 'INTERMEDIATE',
        endorsements: Math.floor(Math.random() * 10) + 3
      })),
      // Natalie Taylor - Legal & Compliance
      ...['Contract Management', 'Regulatory Compliance', 'Legal Research', 'Compliance Auditing', 'Policy Development', 'Risk Assessment', 'Documentation Review', 'Legal Writing', 'Compliance Training', 'Liaison Services'].map(name => ({
        userId: students[9].id,
        name,
        level: 'ADVANCED',
        endorsements: Math.floor(Math.random() * 13) + 6
      }))
    ]

    const skills = await Promise.all(skillsData.map(skill => 
      prisma.skill.create({ data: skill })
    ))

    console.log('✅ Created', skills.length, 'business skills')

    console.log('💼 Creating business experiences...')
    const experiences = await Promise.all([
      prisma.experience.create({
        data: {
          userId: students[0].id,
          title: 'Supply Chain Intern',
          company: 'Dell Technologies',
          location: 'Round Rock, TX',
          description: 'Assisted with supplier onboarding, vendor evaluation, and supply chain process optimization.',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-09-01'),
          current: false,
          skills: 'Supply Chain, Vendor Management, Process Improvement'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[0].id,
          title: 'Risk Analysis Assistant',
          company: 'KPMG',
          location: 'San Francisco, CA',
          description: 'Conducted risk assessments and compliance reviews for client companies.',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2024-05-15'),
          current: false,
          skills: 'Risk Assessment, Compliance, Due Diligence'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[0].id,
          title: 'Business Operations Lead',
          company: 'Student Consulting Group',
          location: 'Stanford, CA',
          description: 'Led a team of 5 student consultants in developing operational improvement plans for small businesses. Managed client relationships, project delivery, and team coordination.',
          startDate: new Date('2023-01-15'),
          endDate: new Date('2023-08-30'),
          current: false,
          skills: 'Leadership, Project Management, Client Relations, Business Analysis, Team Coordination'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[1].id,
          title: 'Trade Documentation Intern',
          company: 'Maersk',
          location: 'Boston, MA',
          description: 'Managed import/export documentation, customs clearance processes, and trade compliance.',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-05-30'),
          current: false,
          skills: 'Trade Documentation, Customs, International Logistics'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[2].id,
          title: 'Talent Acquisition Intern',
          company: 'Deloitte',
          location: 'New York, NY',
          description: 'Assisted with candidate sourcing, screening interviews, and recruitment process management.',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-08-30'),
          current: false,
          skills: 'Recruitment, Candidate Screening, Talent Acquisition'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[3].id,
          title: 'Administrative Assistant Intern',
          company: 'JPMorgan Chase',
          location: 'New York, NY',
          description: 'Managed document workflows, scheduling, and office coordination for executive teams.',
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-09-15'),
          current: false,
          skills: 'Administration, Document Management, Scheduling'
        }
      }),
      prisma.experience.create({
        data: {
          userId: students[4].id,
          title: 'Student Services Intern',
          company: 'NYU Global Programs',
          location: 'New York, NY',
          description: 'Provided career counseling and study-abroad advising to international students.',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-05-15'),
          current: false,
          skills: 'Career Counseling, Student Services, Educational Consulting'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[0].id,
          title: 'Senior Business Consultant',
          company: 'Consulting Excellence LLC',
          location: 'New York, NY',
          description: 'Leading strategic consulting engagements for Fortune 500 clients.',
          startDate: new Date('2018-06-01'),
          endDate: null,
          current: true,
          skills: 'Strategic Planning, Business Analysis, Leadership'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[1].id,
          title: 'HR Director',
          company: 'TalentForce HR Solutions',
          location: 'Chicago, IL',
          description: 'Managing HR operations, talent acquisition, and organizational development for multiple clients.',
          startDate: new Date('2015-06-01'),
          endDate: null,
          current: true,
          skills: 'HR Management, Talent Acquisition, Leadership'
        }
      }),
      prisma.experience.create({
        data: {
          userId: employers[2].id,
          title: 'Operations Director',
          company: 'OptiOps Management',
          location: 'Atlanta, GA',
          description: 'Overseeing operations consulting projects and process improvement initiatives.',
          startDate: new Date('2016-08-01'),
          endDate: null,
          current: true,
          skills: 'Operations Management, Process Improvement, Leadership'
        }
      })
    ])

    console.log('✅ Created', experiences.length, 'experiences')

    console.log('🎓 Creating education records...')
    const education = await Promise.all([
      prisma.education.create({
        data: {
          userId: students[0].id,
          school: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Business Administration',
          description: 'Focus on supply chain management and risk assessment. Graduating with honors.',
          startDate: new Date('2021-09-01'),
          endDate: new Date('2025-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[0].id,
          school: 'London School of Economics',
          degree: 'Study Abroad Certificate',
          field: 'International Business',
          description: 'Semester abroad focusing on global trade regulations, international business practices, and cross-cultural management.',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-05-30')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[1].id,
          school: 'Massachusetts Institute of Technology',
          degree: 'Bachelor of Science',
          field: 'International Business',
          description: 'Specializing in global trade, logistics, and international regulations.',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2026-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[2].id,
          school: 'University of Pennsylvania',
          degree: 'Bachelor of Science',
          field: 'Human Resources Management',
          description: 'Focus on talent acquisition, organizational development, and HR analytics.',
          startDate: new Date('2021-09-01'),
          endDate: new Date('2025-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[3].id,
          school: 'UC Berkeley',
          degree: 'Bachelor of Arts',
          field: 'Administrative Management',
          description: 'Specializing in administrative operations and business support services.',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2026-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[4].id,
          school: 'New York University',
          degree: 'Bachelor of Science',
          field: 'Education & Career Counseling',
          description: 'Focus on educational consulting, career guidance, and student services.',
          startDate: new Date('2021-09-01'),
          endDate: new Date('2025-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[5].id,
          school: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Finance',
          description: 'Concentration in financial analysis and risk management.',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2026-05-15')
        }
      }),
      prisma.education.create({
        data: {
          userId: students[6].id,
          school: 'MIT',
          degree: 'Bachelor of Science',
          field: 'Operations Management',
          description: 'Focus on process optimization and operational efficiency.',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2026-05-15')
        }
      })
    ])

    console.log('✅ Created', education.length, 'education records')

    console.log('📋 Creating business-focused projects...')
    // PROJECT 1: Global Supplier Verification & Risk Assessment Firm - APPROVED, seeking investment
    const project1 = await prisma.project.create({
      data: {
        name: 'Global Supplier Verification & Risk Assessment Firm',
        description: 'A comprehensive B2B firm specializing in supplier due diligence, risk assessment, and compliance verification for multinational corporations. Services include supplier background checks, financial stability analysis, operational audits, compliance verification, risk scoring, ongoing monitoring, and detailed reporting. The firm helps enterprises mitigate supply chain risks by ensuring suppliers meet regulatory requirements, quality standards, and financial stability criteria before onboarding and throughout the business relationship.',
        status: 'IN_PROGRESS',
        ownerId: students[0].id,
        businessId: null,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-15'),
        budget: 250000,
        category: 'Supply Chain Services',
        approvalStatus: 'APPROVED',
        seekingInvestment: true,
        published: true,
        publishedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      }
    })

    // PROJECT 2: Cross-Border Trade Facilitation Company - APPROVED, seeking investment
    const project2 = await prisma.project.create({
      data: {
        name: 'Cross-Border Trade Facilitation Company',
        description: 'A full-service international trade company facilitating cross-border commerce for importers and exporters. Core services include customs brokerage, trade documentation preparation, tariff classification, duty optimization, import/export licensing, logistics coordination, regulatory compliance, trade consulting, and digital documentation management. The company streamlines the complex process of international trade by ensuring compliance with customs regulations, optimizing duty payments, and coordinating end-to-end logistics for seamless cross-border transactions.',
        status: 'IN_PROGRESS',
        ownerId: students[1].id,
        businessId: null,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-15'),
        budget: 300000,
        category: 'International Trade Services',
        approvalStatus: 'APPROVED',
        seekingInvestment: true,
        published: true,
        publishedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      }
    })

    // PROJECT 3: Recruitment Agency - APPROVED, seeking investment
    const project3 = await prisma.project.create({
      data: {
        name: 'Professional Recruitment Agency',
        description: 'A specialized recruitment agency connecting employers with top talent across multiple industries. Services include talent sourcing, candidate screening and evaluation, skills assessment, background verification, salary benchmarking, interview coordination, offer negotiation, onboarding support, and talent analytics. The agency focuses on building long-term partnerships with both employers and candidates, ensuring the right cultural and skills fit while reducing time-to-hire and improving retention rates.',
        status: 'IN_PROGRESS',
        ownerId: students[2].id,
        businessId: null,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-15'),
        budget: 180000,
        category: 'HR & Staffing Services',
        approvalStatus: 'APPROVED',
        seekingInvestment: true,
        published: true,
        publishedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      }
    })

    // PROJECT 4: Admin Support Company - PENDING approval
    const project4 = await prisma.project.create({
      data: {
        name: 'Virtual Administrative Support Company',
        description: 'A modern virtual administrative services company providing comprehensive business support to SMEs and professionals. Services include document management and processing, calendar and scheduling management, email and communication handling, data entry and records management, customer service support, meeting coordination, travel arrangements, project coordination, and workflow optimization. The company helps businesses focus on core operations by handling administrative tasks efficiently through skilled virtual professionals and process-driven approaches.',
        status: 'IN_PROGRESS',
        ownerId: students[3].id,
        businessId: null,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-15'),
        budget: 150000,
        category: 'Administrative Services',
        approvalStatus: 'PENDING',
        seekingInvestment: false,
      }
    })

    // PROJECT 5: Study-Abroad Counseling Agency - PENDING approval
    const project5 = await prisma.project.create({
      data: {
        name: 'International Study-Abroad Counseling Agency',
        description: 'A comprehensive educational consulting agency guiding students through international education opportunities. Services include university and program selection, application preparation and submission, essay writing support, recommendation coordination, test preparation guidance, visa application assistance, pre-departure orientation, accommodation guidance, cultural adaptation support, and career pathway planning. The agency maintains partnerships with universities worldwide and specializes in matching students with programs aligned with their academic goals, career aspirations, and budget considerations.',
        status: 'IN_PROGRESS',
        ownerId: students[4].id,
        businessId: null,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-05-15'),
        budget: 200000,
        category: 'Educational Consulting',
        approvalStatus: 'UNDER_REVIEW',
        seekingInvestment: true,
      }
    })

    const projects = [project1, project2, project3, project4, project5]
    console.log('✅ Created', projects.length, 'business-focused projects')

    console.log('👥 Adding project team members...')
    // Project 1 Team - Global Supplier Verification Firm
    const project1Members = await Promise.all([
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[0].id, role: 'OWNER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[5].id, role: 'PROJECT_MANAGER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[9].id, role: 'TEAM_LEAD' }
      }),
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[6].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[8].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project1.id, userId: students[1].id, role: 'TEAM_MEMBER' }
      })
    ])

    // Project 2 Team - Cross-Border Trade Company
    const project2Members = await Promise.all([
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[1].id, role: 'OWNER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[6].id, role: 'PROJECT_MANAGER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[9].id, role: 'TEAM_LEAD' }
      }),
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[0].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[5].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project2.id, userId: students[8].id, role: 'TEAM_MEMBER' }
      })
    ])

    // Project 3 Team - Recruitment Agency
    const project3Members = await Promise.all([
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: students[2].id, role: 'OWNER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: employers[1].id, role: 'PROJECT_MANAGER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: students[7].id, role: 'TEAM_LEAD' }
      }),
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: students[3].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: students[4].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project3.id, userId: students[9].id, role: 'TEAM_MEMBER' }
      })
    ])

    // Project 4 Team - Admin Support Company
    const project4Members = await Promise.all([
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[3].id, role: 'OWNER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[7].id, role: 'PROJECT_MANAGER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[6].id, role: 'TEAM_LEAD' }
      }),
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[0].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[5].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project4.id, userId: students[8].id, role: 'TEAM_MEMBER' }
      })
    ])

    // Project 5 Team - Study-Abroad Counseling
    const project5Members = await Promise.all([
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: students[4].id, role: 'OWNER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: employers[0].id, role: 'PROJECT_MANAGER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: students[7].id, role: 'TEAM_LEAD' }
      }),
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: students[1].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: students[2].id, role: 'TEAM_MEMBER' }
      }),
      prisma.projectMember.create({
        data: { projectId: project5.id, userId: students[9].id, role: 'TEAM_MEMBER' }
      })
    ])

    const allProjectMembers = [
      ...project1Members, ...project2Members, ...project3Members, ...project4Members, ...project5Members
    ]
    console.log('✅ Created', allProjectMembers.length, 'project team members')

    console.log('🏢 Creating departments for each project...')
    // Project 1 Departments
    const project1Depts = await Promise.all([
      prisma.department.create({
        data: { projectId: project1.id, name: 'Due Diligence Team', headId: students[5].id }
      }),
      prisma.department.create({
        data: { projectId: project1.id, name: 'Risk Assessment Team', headId: students[9].id }
      }),
      prisma.department.create({
        data: { projectId: project1.id, name: 'Compliance Verification Team', headId: students[6].id }
      }),
      prisma.department.create({
        data: { projectId: project1.id, name: 'Client Services Team', headId: students[0].id }
      })
    ])

    // Project 2 Departments
    const project2Depts = await Promise.all([
      prisma.department.create({
        data: { projectId: project2.id, name: 'Trade Documentation Team', headId: students[6].id }
      }),
      prisma.department.create({
        data: { projectId: project2.id, name: 'Logistics Coordination Team', headId: students[9].id }
      }),
      prisma.department.create({
        data: { projectId: project2.id, name: 'Customs Relations Team', headId: students[0].id }
      }),
      prisma.department.create({
        data: { projectId: project2.id, name: 'Compliance Advisory Team', headId: students[5].id }
      })
    ])

    // Project 3 Departments
    const project3Depts = await Promise.all([
      prisma.department.create({
        data: { projectId: project3.id, name: 'Talent Sourcing Team', headId: students[2].id }
      }),
      prisma.department.create({
        data: { projectId: project3.id, name: 'Candidate Screening Team', headId: employers[1].id }
      }),
      prisma.department.create({
        data: { projectId: project3.id, name: 'Client Relations Team', headId: students[7].id }
      }),
      prisma.department.create({
        data: { projectId: project3.id, name: 'Placement Services Team', headId: students[4].id }
      })
    ])

    // Project 4 Departments
    const project4Depts = await Promise.all([
      prisma.department.create({
        data: { projectId: project4.id, name: 'Document Management Team', headId: students[7].id }
      }),
      prisma.department.create({
        data: { projectId: project4.id, name: 'Client Support Team', headId: students[3].id }
      }),
      prisma.department.create({
        data: { projectId: project4.id, name: 'Quality Control Team', headId: students[6].id }
      }),
      prisma.department.create({
        data: { projectId: project4.id, name: 'Specialized Services Team', headId: students[5].id }
      })
    ])

    // Project 5 Departments
    const project5Depts = await Promise.all([
      prisma.department.create({
        data: { projectId: project5.id, name: 'Admissions Team', headId: students[4].id }
      }),
      prisma.department.create({
        data: { projectId: project5.id, name: 'Visa Services Team', headId: employers[0].id }
      }),
      prisma.department.create({
        data: { projectId: project5.id, name: 'Career Counseling Team', headId: students[7].id }
      }),
      prisma.department.create({
        data: { projectId: project5.id, name: 'Partner Relations Team', headId: students[2].id }
      })
    ])

    const allDepartments = [
      ...project1Depts, ...project2Depts, ...project3Depts, ...project4Depts, ...project5Depts
    ]
    console.log('✅ Created', allDepartments.length, 'departments')

    console.log('✅ Creating milestones for each project...')
    // Project 1 Milestones
    const project1Milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: project1.id,
          title: 'Service Framework Development Complete',
          description: 'Complete development of all service frameworks, including due diligence processes, risk assessment methodologies, and compliance verification standards.',
          status: 'COMPLETED',
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          metrics: 'Service documentation complete, process maps finalized, quality standards defined'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project1.id,
          title: 'First Client Acquisition',
          description: 'Secure first paying client and complete initial supplier verification engagement.',
          status: 'COMPLETED',
          dueDate: new Date('2024-11-30'),
          completedAt: new Date('2024-11-28'),
          metrics: '1 paying client, initial project delivered, client satisfaction 4.5/5'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project1.id,
          title: 'Client Portfolio Expansion to 5',
          description: 'Expand client base to 5 active clients across different industries.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          metrics: '5 active clients, 3 industries represented, 90% client retention'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project1.id,
          title: 'Revenue Target Achievement',
          description: 'Achieve annual revenue target of $250,000 with sustainable profit margins.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '$250,000 revenue, 20% profit margin, diversified revenue streams'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project1.id,
          title: 'Industry Certification Obtained',
          description: 'Obtain industry certification for verification services quality.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          metrics: 'ISO 27001 certification, third-party audit passed, certification documentation'
        }
      })
    ])

    // Project 2 Milestones
    const project2Milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: project2.id,
          title: 'Trade Documentation System Live',
          description: 'Launch digital trade documentation system with all required forms and workflows.',
          status: 'COMPLETED',
          dueDate: new Date('2024-10-31'),
          completedAt: new Date('2024-10-28'),
          metrics: 'System operational, 50 document templates, 5 country-specific modules'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project2.id,
          title: 'Customs Broker License Secured',
          description: 'Obtain customs broker license in primary operating region.',
          status: 'COMPLETED',
          dueDate: new Date('2024-11-30'),
          completedAt: new Date('2024-11-25'),
          metrics: 'License obtained, compliance verified, broker registration complete'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project2.id,
          title: 'First 100 Cross-Border Shipments',
          description: 'Successfully facilitate 100 cross-border shipments with zero compliance issues.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-02-15'),
          completedAt: null,
          metrics: '100 shipments, 0 compliance violations, 95% on-time delivery'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project2.id,
          title: 'Logistics Partnership Network',
          description: 'Establish partnerships with 10 logistics providers across key trade routes.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          metrics: '10 logistics partners, 5 major trade routes covered, partnership contracts signed'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project2.id,
          title: 'Revenue Milestone $300,000',
          description: 'Achieve $300,000 in annual revenue from trade facilitation services.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '$300,000 revenue, average shipment value $3,000, repeat business rate 40%'
        }
      })
    ])

    // Project 3 Milestones
    const project3Milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: project3.id,
          title: 'Recruitment Platform Launch',
          description: 'Launch internal recruitment platform with candidate database and job matching.',
          status: 'COMPLETED',
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-10'),
          metrics: 'Platform live, 200 candidate profiles, 15 client job postings'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project3.id,
          title: 'First 10 Successful Placements',
          description: 'Complete 10 successful candidate placements with 90% retention after 90 days.',
          status: 'COMPLETED',
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-28'),
          metrics: '10 placements, 9 retained after 90 days, average placement fee $8,000'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project3.id,
          title: 'Client Base Expansion to 15',
          description: 'Expand to 15 active clients with recurring placement needs.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          metrics: '15 active clients, 3 industries represented, $120,000 contract value'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project3.id,
          title: 'Total 50 Successful Placements',
          description: 'Achieve 50 total successful candidate placements for the fiscal year.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '50 total placements, 85% retention rate, $400,000 total revenue'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project3.id,
          title: 'Industry Recognition',
          description: 'Receive industry recognition or award for excellence in recruitment.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          metrics: 'Industry award or recognition, client testimonials, PR coverage'
        }
      })
    ])

    // Project 4 Milestones
    const project4Milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: project4.id,
          title: 'Service Catalog Finalized',
          description: 'Complete service catalog with pricing tiers and service level agreements.',
          status: 'COMPLETED',
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          metrics: '15 services defined, 3 pricing tiers, SLAs documented'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project4.id,
          title: 'First 20 Clients Onboarded',
          description: 'Successfully onboard and serve 20 active clients.',
          status: 'COMPLETED',
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-29'),
          metrics: '20 clients, 95% satisfaction, average client value $1,500/month'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project4.id,
          title: 'Team Expansion to 15 Virtual Assistants',
          description: 'Build team of 15 trained virtual assistants across different specializations.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          metrics: '15 VAs, 5 specializations, training program complete'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project4.id,
          title: 'Monthly Recurring Revenue $30,000',
          description: 'Achieve $30,000 in monthly recurring revenue from client subscriptions.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '$30,000 MRR, 85% client retention, $360,000 ARR'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project4.id,
          title: 'Process Automation Implementation',
          description: 'Implement workflow automation tools to reduce manual tasks by 40%.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          metrics: '40% task automation, 5 tools integrated, efficiency metrics improved'
        }
      })
    ])

    // Project 5 Milestones
    const project5Milestones = await Promise.all([
      prisma.milestone.create({
        data: {
          projectId: project5.id,
          title: 'University Partnerships Established',
          description: 'Secure partnerships with 50 universities across 10 countries.',
          status: 'COMPLETED',
          dueDate: new Date('2024-10-31'),
          completedAt: new Date('2024-10-28'),
          metrics: '50 university partners, 10 countries, 5 MOUs signed'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project5.id,
          title: 'First 50 Students Placed',
          description: 'Successfully place 50 students in international education programs.',
          status: 'COMPLETED',
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-27'),
          metrics: '50 students placed, 92% admission success, 88% visa success'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project5.id,
          title: 'Counseling Services Framework',
          description: 'Complete comprehensive counseling framework with assessment tools and career pathways.',
          status: 'IN_PROGRESS',
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          metrics: 'Framework complete, assessment tools ready, 20 career pathways defined'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project5.id,
          title: 'Student Success Rate 90%',
          description: 'Achieve 90% overall student success rate in program completion.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '90% completion rate, 95% student satisfaction, 85% job placement after studies'
        }
      }),
      prisma.milestone.create({
        data: {
          projectId: project5.id,
          title: 'Revenue Target $200,000',
          description: 'Achieve $200,000 annual revenue from counseling and placement services.',
          status: 'NOT_STARTED',
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          metrics: '$200,000 revenue, average revenue $4,000/student, diversified income streams'
        }
      })
    ])

    const allMilestones = [
      ...project1Milestones, ...project2Milestones, ...project3Milestones, 
      ...project4Milestones, ...project5Milestones
    ]
    console.log('✅ Created', allMilestones.length, 'milestones')

    console.log('📋 Creating comprehensive tasks for each project...')
    // PROJECT 1 TASKS - Supplier Verification Firm
    const project1Tasks = await Promise.all([
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Design Due Diligence Framework',
          description: 'Create comprehensive due diligence framework including supplier evaluation criteria, verification checklists, and scoring methodology.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[5].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-09-30'),
          completedAt: new Date('2024-09-28'),
          estimatedHours: 40,
          actualHours: 42
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Develop Risk Assessment Methodology',
          description: 'Design risk assessment methodology covering financial, operational, compliance, and geopolitical risks with rating system.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[9].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          estimatedHours: 50,
          actualHours: 48
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Create Compliance Verification Protocols',
          description: 'Develop compliance verification protocols for different industries and regulatory frameworks.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[6].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-20'),
          completedAt: new Date('2024-10-18'),
          estimatedHours: 35,
          actualHours: 38
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Build Supplier Database Structure',
          description: 'Design and implement database structure to track supplier information, verification status, and risk scores.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[8].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-10'),
          completedAt: new Date('2024-10-08'),
          estimatedHours: 30,
          actualHours: 32
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Develop Client Reporting Templates',
          description: 'Create client-facing reports with supplier verification results, risk scores, and recommendations.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[5].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-25'),
          completedAt: new Date('2024-10-23'),
          estimatedHours: 25,
          actualHours: 24
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Conduct Market Research on Competitors',
          description: 'Research competitor offerings, pricing models, and service differentiators.',
          status: 'DONE',
          priority: 'MEDIUM',
          assignedTo: students[1].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-09-20'),
          completedAt: new Date('2024-09-18'),
          estimatedHours: 20,
          actualHours: 18
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Pricing Model Development',
          description: 'Develop tiered pricing model based on verification complexity, supplier size, and ongoing monitoring needs.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[5].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-05'),
          completedAt: new Date('2024-10-03'),
          estimatedHours: 30,
          actualHours: 28
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Website and Marketing Materials',
          description: 'Develop professional website, service brochures, and marketing collateral.',
          status: 'DONE',
          priority: 'MEDIUM',
          assignedTo: students[0].id,
          assignedBy: students[0].id,
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          estimatedHours: 40,
          actualHours: 45
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Client Acquisition Outreach',
          description: 'Execute targeted outreach to potential clients including cold calls, emails, and networking events.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[0].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          estimatedHours: 120,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Onboard First 5 Clients',
          description: 'Complete onboarding process for first 5 clients including contract signing and initial assessments.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[5].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          estimatedHours: 80,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Implement Ongoing Monitoring System',
          description: 'Set up system for ongoing supplier monitoring with automated alerts for risk changes.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[6].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          estimatedHours: 50,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Prepare for ISO 27001 Certification',
          description: 'Prepare documentation and processes for ISO 27001 information security certification.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[9].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-03-30'),
          completedAt: null,
          estimatedHours: 60,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Client Success Reviews',
          description: 'Conduct quarterly client success reviews and collect testimonials.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[0].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-05-10'),
          completedAt: null,
          estimatedHours: 20,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Financial Performance Analysis',
          description: 'Analyze financial performance against revenue targets and adjust strategy accordingly.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[5].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 25,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project1.id,
          title: 'Service Expansion Research',
          description: 'Research additional verification services to expand offering (e.g., ESG verification, supply chain mapping).',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[9].id,
          assignedBy: students[0].id,
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      })
    ])

    // PROJECT 2 TASKS - Cross-Border Trade Company
    const project2Tasks = await Promise.all([
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Research Customs Regulations for Target Markets',
          description: 'Comprehensive research of customs regulations for US, Canada, UK, EU, and major Asian markets.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[6].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-09-30'),
          completedAt: new Date('2024-09-27'),
          estimatedHours: 60,
          actualHours: 58
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Design Trade Document Templates',
          description: 'Create templates for all required trade documents: commercial invoices, packing lists, certificates of origin, etc.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[6].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          estimatedHours: 45,
          actualHours: 48
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Apply for Customs Broker License',
          description: 'Complete application process for customs broker license including exam preparation and documentation.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[1].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-11-15'),
          completedAt: new Date('2024-11-10'),
          estimatedHours: 40,
          actualHours: 42
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Develop Tariff Classification System',
          description: 'Build tariff classification system using HS codes with automated classification suggestions.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[8].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-10-20'),
          completedAt: new Date('2024-10-17'),
          estimatedHours: 50,
          actualHours: 52
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Build Logistics Partner Network',
          description: 'Identify and establish partnerships with logistics providers for ocean, air, and ground freight.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: students[9].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          estimatedHours: 80,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Create Digital Documentation Platform',
          description: 'Build platform for digital document management, electronic submission, and real-time tracking.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[0].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-10-30'),
          completedAt: new Date('2024-10-26'),
          estimatedHours: 70,
          actualHours: 75
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Develop Duty Optimization Calculator',
          description: 'Create tool to calculate optimal duty payments through tariff analysis and trade agreement utilization.',
          status: 'DONE',
          priority: 'MEDIUM',
          assignedTo: students[5].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-11-30'),
          completedAt: new Date('2024-11-27'),
          estimatedHours: 35,
          actualHours: 33
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Client Onboarding Process',
          description: 'Design streamlined client onboarding with account setup, document templates, and training.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[6].id,
          assignedBy: students[1].id,
          dueDate: new Date('2024-10-25'),
          completedAt: new Date('2024-10-22'),
          estimatedHours: 25,
          actualHours: 24
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Market Entry Strategy',
          description: 'Develop market entry strategy targeting importers and exporters in key industries.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: students[1].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-01-31'),
          completedAt: null,
          estimatedHours: 40,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Process 100 Shipments Pilot',
          description: 'Execute pilot program to process 100 shipments and refine processes based on learnings.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[9].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          estimatedHours: 100,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Establish Customs Relationships',
          description: 'Build relationships with customs officials at major ports to expedite clearance processes.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[0].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          estimatedHours: 50,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Develop Compliance Monitoring System',
          description: 'Implement system to monitor regulatory changes and update clients on compliance requirements.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[5].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          estimatedHours: 35,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Performance Metrics Dashboard',
          description: 'Create dashboard tracking shipment metrics, clearance times, duty savings, and client satisfaction.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[8].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Revenue Growth Strategy',
          description: 'Develop and execute revenue growth strategy to achieve $300,000 annual target.',
          status: 'TODO',
          priority: 'CRITICAL',
          assignedTo: students[1].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 40,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project2.id,
          title: 'Client Retention Program',
          description: 'Develop client retention program with loyalty benefits, volume discounts, and account reviews.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[6].id,
          assignedBy: students[1].id,
          dueDate: new Date('2025-05-10'),
          completedAt: null,
          estimatedHours: 25,
          actualHours: null
        }
      })
    ])

    // PROJECT 3 TASKS - Recruitment Agency
    const project3Tasks = await Promise.all([
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Define Recruitment Service Specializations',
          description: 'Define focus industries and job categories for recruitment services (tech, finance, healthcare).',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[2].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-09-30'),
          completedAt: new Date('2024-09-28'),
          estimatedHours: 30,
          actualHours: 28
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Design Candidate Sourcing Strategy',
          description: 'Develop multi-channel candidate sourcing strategy including LinkedIn, job boards, referrals, and networking.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[2].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-10-10'),
          completedAt: new Date('2024-10-08'),
          estimatedHours: 40,
          actualHours: 38
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Create Candidate Screening Framework',
          description: 'Design comprehensive screening process with interviews, skills assessment, and background checks.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: employers[1].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-10-20'),
          completedAt: new Date('2024-10-17'),
          estimatedHours: 45,
          actualHours: 43
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Build Recruitment Platform',
          description: 'Develop internal platform for candidate database, job tracking, and client management.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[3].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          estimatedHours: 60,
          actualHours: 65
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Develop Client Fee Structure',
          description: 'Create transparent fee structure with placement fees, retainer options, and success guarantees.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-10-05'),
          completedAt: new Date('2024-10-03'),
          estimatedHours: 25,
          actualHours: 24
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Marketing and Brand Development',
          description: 'Develop agency branding, website, and marketing materials for B2B client acquisition.',
          status: 'DONE',
          priority: 'MEDIUM',
          assignedTo: students[7].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-10-25'),
          completedAt: new Date('2024-10-22'),
          estimatedHours: 35,
          actualHours: 33
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'First 5 Client Contracts',
          description: 'Secure first 5 client contracts with clear scope and service agreements.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[2].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-11-30'),
          completedAt: new Date('2024-11-27'),
          estimatedHours: 50,
          actualHours: 48
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Execute First 10 Placements',
          description: 'Complete full recruitment cycle for 10 positions from sourcing to placement.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: employers[1].id,
          assignedBy: students[2].id,
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-28'),
          estimatedHours: 120,
          actualHours: 125
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Client Expansion to 15 Accounts',
          description: 'Expand client base to 15 active accounts with recurring hiring needs.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          estimatedHours: 80,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Achieve 50 Total Placements',
          description: 'Execute recruitment for 50 positions across all client accounts.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[2].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 200,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Client Success Reviews',
          description: 'Conduct quarterly reviews with clients to assess placement quality and satisfaction.',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          assignedTo: students[4].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          estimatedHours: 40,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Retention Rate Improvement',
          description: 'Implement strategies to improve 90-day placement retention rate to 90%.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: employers[1].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          estimatedHours: 35,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Industry Award Application',
          description: 'Prepare and submit application for industry recognition or recruitment excellence award.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[9].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-04-01'),
          completedAt: null,
          estimatedHours: 20,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Service Expansion Planning',
          description: 'Research and plan additional services: executive search, contract staffing, RPO.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[2].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-05-10'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project3.id,
          title: 'Revenue and Profit Analysis',
          description: 'Analyze revenue by client, placement fees, and profitability by service line.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[2].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 25,
          actualHours: null
        }
      })
    ])

    // PROJECT 4 TASKS - Admin Support Company
    const project4Tasks = await Promise.all([
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Define Service Catalog',
          description: 'Create comprehensive service catalog with detailed descriptions and deliverables for each service.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[3].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-09-30'),
          completedAt: new Date('2024-09-27'),
          estimatedHours: 35,
          actualHours: 33
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Develop Pricing Strategy',
          description: 'Design tiered pricing with hourly packages, monthly retainers, and enterprise plans.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-10-10'),
          completedAt: new Date('2024-10-08'),
          estimatedHours: 30,
          actualHours: 28
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Create Service Level Agreements',
          description: 'Draft SLAs for response times, quality standards, and service guarantees.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[6].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-10-15'),
          completedAt: new Date('2024-10-12'),
          estimatedHours: 25,
          actualHours: 24
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Recruit and Train Virtual Assistants',
          description: 'Recruit first 5 VAs and deliver comprehensive training on service standards.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[7].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-10-30'),
          completedAt: new Date('2024-10-27'),
          estimatedHours: 60,
          actualHours: 58
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Build Client Onboarding System',
          description: 'Create streamlined onboarding process with intake forms, kickoff calls, and service setup.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[3].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-10-20'),
          completedAt: new Date('2024-10-18'),
          estimatedHours: 30,
          actualHours: 32
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Marketing and Lead Generation',
          description: 'Execute marketing campaigns targeting SMEs, startups, and professionals needing admin support.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[3].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-11-15'),
          completedAt: new Date('2024-11-12'),
          estimatedHours: 50,
          actualHours: 48
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Onboard First 20 Clients',
          description: 'Complete onboarding for 20 clients and deliver initial services.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[3].id,
          assignedBy: students[3].id,
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-29'),
          estimatedHours: 100,
          actualHours: 105
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Expand VA Team to 15',
          description: 'Recruit and train additional VAs to reach team size of 15 across specializations.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          estimatedHours: 80,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Achieve $30,000 Monthly Recurring Revenue',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[6].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 60,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Implement Workflow Automation Tools',
          description: 'Research and implement automation tools to reduce manual tasks by 40%.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[5].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-04-15'),
          completedAt: null,
          estimatedHours: 50,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Quality Assurance Program',
          description: 'Implement QA program with client feedback loops, service audits, and improvement tracking.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[6].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          estimatedHours: 40,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Client Retention Strategy',
          description: 'Develop and execute retention strategy to maintain 85% client renewal rate.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[3].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-05-10'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Performance Metrics Dashboard',
          description: 'Create dashboard tracking KPIs: client satisfaction, response times, retention, revenue.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[8].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-04-20'),
          completedAt: null,
          estimatedHours: 25,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project4.id,
          title: 'Service Expansion Planning',
          description: 'Plan additional services: bookkeeping, social media management, customer support outsourcing.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[5].id,
          assignedBy: students[3].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 35,
          actualHours: null
        }
      })
    ])

    // PROJECT 5 TASKS - Study-Abroad Counseling Agency
    const project5Tasks = await Promise.all([
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Research Target Universities and Programs',
          description: 'Comprehensive research of universities in US, UK, Canada, Australia, and Europe.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-09-30'),
          completedAt: new Date('2024-09-27'),
          estimatedHours: 80,
          actualHours: 75
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Establish University Partnerships',
          description: 'Execute partnership outreach and secure MOUs with 50 universities.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-10-31'),
          completedAt: new Date('2024-10-28'),
          estimatedHours: 100,
          actualHours: 95
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Design Counseling Framework',
          description: 'Create structured counseling framework with assessment tools and career pathway mapping.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-02-28'),
          completedAt: null,
          estimatedHours: 60,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Create Application Support Materials',
          description: 'Develop templates and guides for personal statements, resumes, and application materials.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[2].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-10-20'),
          completedAt: new Date('2024-10-17'),
          estimatedHours: 50,
          actualHours: 48
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Build Visa Application Knowledge Base',
          description: 'Create comprehensive guides for student visa processes for major destination countries.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: employers[0].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-11-15'),
          completedAt: new Date('2024-11-12'),
          estimatedHours: 70,
          actualHours: 68
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Develop Student Assessment Tools',
          description: 'Create assessment tools to evaluate student academic profile, goals, and fit for programs.',
          status: 'DONE',
          priority: 'MEDIUM',
          assignedTo: students[7].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-10-30'),
          completedAt: new Date('2024-10-27'),
          estimatedHours: 40,
          actualHours: 38
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Market to Prospective Students',
          description: 'Execute marketing campaigns targeting students interested in international education.',
          status: 'DONE',
          priority: 'HIGH',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-11-30'),
          completedAt: new Date('2024-11-27'),
          estimatedHours: 60,
          actualHours: 55
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'First 50 Student Placements',
          description: 'Guide 50 students through complete application and enrollment process.',
          status: 'DONE',
          priority: 'CRITICAL',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-28'),
          estimatedHours: 200,
          actualHours: 210
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Pre-Departure Orientation Program',
          description: 'Develop comprehensive pre-departure orientation covering culture, academics, and practical matters.',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          assignedTo: students[1].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-03-31'),
          completedAt: null,
          estimatedHours: 50,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Achieve 90% Success Rate',
          description: 'Implement support systems to achieve 90% program completion and placement rate.',
          status: 'IN_PROGRESS',
          priority: 'CRITICAL',
          assignedTo: students[7].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 80,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Alumni Network Development',
          description: 'Build alumni network for testimonials, referrals, and current student support.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[2].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-04-30'),
          completedAt: null,
          estimatedHours: 40,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'University Relationship Management',
          description: 'Maintain and strengthen relationships with partner universities through regular communication.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-05-10'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Revenue Optimization',
          description: 'Analyze revenue streams and optimize pricing for counseling and placement services.',
          status: 'TODO',
          priority: 'HIGH',
          assignedTo: students[7].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 35,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Testimonial and Case Study Development',
          description: 'Collect and develop testimonials and case studies from successful students.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[9].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-05-01'),
          completedAt: null,
          estimatedHours: 25,
          actualHours: null
        }
      }),
      prisma.task.create({
        data: {
          projectId: project5.id,
          title: 'Service Expansion Planning',
          description: 'Plan expansion services: scholarship assistance, housing support, career services.',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: students[4].id,
          assignedBy: students[4].id,
          dueDate: new Date('2025-05-15'),
          completedAt: null,
          estimatedHours: 30,
          actualHours: null
        }
      })
    ])

    const allTasks = [
      ...project1Tasks, ...project2Tasks, ...project3Tasks, ...project4Tasks, ...project5Tasks
    ]
    console.log('✅ Created', allTasks.length, 'tasks')

    console.log('🔄 Updating tasks with current step IDs...')
    // Update all tasks with currentStepId based on their status
    const statusToStepMap = {
      'TODO': '1',
      'IN_PROGRESS': '2',
      'REVIEW': '3',
      'DONE': '4'
    }

    for (const task of allTasks) {
      const currentStepId = statusToStepMap[task.status as keyof typeof statusToStepMap]
      await prisma.task.update({
        where: { id: task.id },
        data: { currentStepId }
      })
    }
    console.log('✅ Updated', allTasks.length, 'tasks with current step IDs')

    console.log('📋 Creating subtasks...')
    // Sample subtasks for key tasks
    const subtasks = await Promise.all([
      // Subtasks for Project 1 - Due Diligence Framework
      prisma.subTask.create({
        data: { taskId: project1Tasks[0].id, title: 'Research industry standards', completed: true, sortOrder: 1 }
      }),
      prisma.subTask.create({
        data: { taskId: project1Tasks[0].id, title: 'Design evaluation criteria', completed: true, sortOrder: 2 }
      }),
      prisma.subTask.create({
        data: { taskId: project1Tasks[0].id, title: 'Create verification checklists', completed: true, sortOrder: 3 }
      }),
      prisma.subTask.create({
        data: { taskId: project1Tasks[0].id, title: 'Develop scoring system', completed: true, sortOrder: 4 }
      }),
      // Subtasks for Project 2 - Customs Regulations
      prisma.subTask.create({
        data: { taskId: project2Tasks[0].id, title: 'Research US customs regulations', completed: true, sortOrder: 1 }
      }),
      prisma.subTask.create({
        data: { taskId: project2Tasks[0].id, title: 'Research EU customs regulations', completed: true, sortOrder: 2 }
      }),
      prisma.subTask.create({
        data: { taskId: project2Tasks[0].id, title: 'Research Asian market regulations', completed: true, sortOrder: 3 }
      }),
      prisma.subTask.create({
        data: { taskId: project2Tasks[0].id, title: 'Document all regulatory requirements', completed: true, sortOrder: 4 }
      }),
      // Subtasks for Project 3 - Candidate Sourcing
      prisma.subTask.create({
        data: { taskId: project3Tasks[1].id, title: 'Identify sourcing channels', completed: true, sortOrder: 1 }
      }),
      prisma.subTask.create({
        data: { taskId: project3Tasks[1].id, title: 'Create outreach templates', completed: true, sortOrder: 2 }
      }),
      prisma.subTask.create({
        data: { taskId: project3Tasks[1].id, title: 'Set up LinkedIn strategy', completed: true, sortOrder: 3 }
      }),
      prisma.subTask.create({
        data: { taskId: project3Tasks[1].id, title: 'Establish referral program', completed: true, sortOrder: 4 }
      }),
      // Subtasks for Project 4 - Service Catalog
      prisma.subTask.create({
        data: { taskId: project4Tasks[0].id, title: 'List all potential services', completed: true, sortOrder: 1 }
      }),
      prisma.subTask.create({
        data: { taskId: project4Tasks[0].id, title: 'Define service deliverables', completed: true, sortOrder: 2 }
      }),
      prisma.subTask.create({
        data: { taskId: project4Tasks[0].id, title: 'Create service descriptions', completed: true, sortOrder: 3 }
      }),
      prisma.subTask.create({
        data: { taskId: project4Tasks[0].id, title: 'Develop pricing recommendations', completed: true, sortOrder: 4 }
      }),
      // Subtasks for Project 5 - University Research
      prisma.subTask.create({
        data: { taskId: project5Tasks[0].id, title: 'Research US universities', completed: true, sortOrder: 1 }
      }),
      prisma.subTask.create({
        data: { taskId: project5Tasks[0].id, title: 'Research UK universities', completed: true, sortOrder: 2 }
      }),
      prisma.subTask.create({
        data: { taskId: project5Tasks[0].id, title: 'Research Canadian universities', completed: true, sortOrder: 3 }
      }),
      prisma.subTask.create({
        data: { taskId: project5Tasks[0].id, title: 'Research European universities', completed: true, sortOrder: 4 }
      }),
      prisma.subTask.create({
        data: { taskId: project5Tasks[0].id, title: 'Compile program requirements', completed: true, sortOrder: 5 }
      })
    ])

    console.log('✅ Created', subtasks.length, 'subtasks')

    console.log('🔗 Creating task dependencies...')
    const taskDependencies = await Promise.all([
      prisma.taskDependency.create({
        data: { taskId: project1Tasks[6].id, dependsOnId: project1Tasks[0].id }
      }),
      prisma.taskDependency.create({
        data: { taskId: project1Tasks[9].id, dependsOnId: project1Tasks[6].id }
      }),
      prisma.taskDependency.create({
        data: { taskId: project2Tasks[5].id, dependsOnId: project2Tasks[0].id }
      })
    ])

    console.log('✅ Created', taskDependencies.length, 'task dependencies')

    console.log('👤 Creating personal tasks for students...')
    // Personal Tasks for students (no project association)
    const personalTasks = await Promise.all([
      // Alex Thompson's Personal Tasks
      prisma.personalTask.create({
        data: {
          userId: students[0].id,
          title: 'Complete Business Administration Assignment',
          description: 'Final assignment for Business Administration course covering supply chain strategies.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2025-01-20'),
          completedAt: null
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[0].id,
          title: 'Prepare for Supply Chain Certification',
          description: 'Study materials and practice for upcoming certification exam.',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date('2025-02-15'),
          completedAt: null
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[0].id,
          title: 'Update Resume and Portfolio',
          description: 'Add recent project experience to resume and update online portfolio.',
          status: 'DONE',
          priority: 'LOW',
          dueDate: new Date('2024-12-31'),
          completedAt: new Date('2024-12-28')
        }
      }),
      // Emily Chen's Personal Tasks
      prisma.personalTask.create({
        data: {
          userId: students[1].id,
          title: 'Research Trade Regulations Paper',
          description: 'Academic paper on emerging international trade regulations.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2025-01-25'),
          completedAt: null
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[1].id,
          title: 'Apply for Summer Internship',
          description: 'Apply to trade facilitation companies for summer internship.',
          status: 'TODO',
          priority: 'CRITICAL',
          dueDate: new Date('2025-03-01'),
          completedAt: null
        }
      }),
      // Marcus Williams's Personal Tasks
      prisma.personalTask.create({
        data: {
          userId: students[2].id,
          title: 'Recruitment Workshop Preparation',
          description: 'Prepare materials for upcoming recruitment training workshop.',
          status: 'REVIEW',
          priority: 'MEDIUM',
          dueDate: new Date('2025-01-15'),
          completedAt: null
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[2].id,
          title: 'Candidate Screening Practice',
          description: 'Practice candidate screening techniques and improve evaluation skills.',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date('2025-02-01'),
          completedAt: null
        }
      }),
      // Sophia Martinez's Personal Tasks
      prisma.personalTask.create({
        data: {
          userId: students[3].id,
          title: 'Administrative Systems Certification',
          description: 'Complete certification for advanced administrative management systems.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2025-01-30'),
          completedAt: null
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[3].id,
          title: 'Virtual Team Management Course',
          description: 'Online course on managing virtual teams effectively.',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date('2025-03-15'),
          completedAt: null
        }
      }),
      // James Rodriguez's Personal Tasks
      prisma.personalTask.create({
        data: {
          userId: students[4].id,
          title: 'Counseling Ethics Exam',
          description: 'Prepare for and complete counseling ethics examination.',
          status: 'DONE',
          priority: 'CRITICAL',
          dueDate: new Date('2024-12-20'),
          completedAt: new Date('2024-12-18')
        }
      }),
      prisma.personalTask.create({
        data: {
          userId: students[4].id,
          title: 'Study Abroad Program Guide Update',
          description: 'Update program guide with latest visa requirements and partner universities.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date('2025-02-01'),
          completedAt: null
        }
      }),
    ])

    console.log('✅ Created', personalTasks.length, 'personal tasks')

    console.log('🔄 Creating task step history...')
    // Task Step records for workflow tracking
    const taskSteps = await Promise.all([
      // Steps for Project 1 tasks
      prisma.taskStep.create({
        data: {
          taskId: project1Tasks[0].id,
          stepNumber: '1',
          name: 'To Do',
          description: 'Task created and assigned',
          movedBy: students[0].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project1Tasks[0].id,
          stepNumber: '2',
          name: 'In Progress',
          description: 'Started working on due diligence framework',
          movedBy: students[0].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project1Tasks[0].id,
          stepNumber: '3',
          name: 'Review',
          description: 'Framework submitted for review',
          movedBy: students[5].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project1Tasks[0].id,
          stepNumber: '4',
          name: 'Done',
          description: 'Framework completed and approved',
          movedBy: students[0].id
        }
      }),
      // Steps for Project 2 tasks
      prisma.taskStep.create({
        data: {
          taskId: project2Tasks[0].id,
          stepNumber: '1',
          name: 'To Do',
          description: 'Task created and assigned',
          movedBy: students[1].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project2Tasks[0].id,
          stepNumber: '4',
          name: 'Done',
          description: 'Customs regulations research completed',
          movedBy: students[1].id
        }
      }),
      // Steps for Project 3 tasks
      prisma.taskStep.create({
        data: {
          taskId: project3Tasks[0].id,
          stepNumber: '1',
          name: 'To Do',
          description: 'Task created and assigned',
          movedBy: students[2].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project3Tasks[0].id,
          stepNumber: '2',
          name: 'In Progress',
          description: 'Developing recruitment framework',
          movedBy: students[2].id
        }
      }),
      prisma.taskStep.create({
        data: {
          taskId: project3Tasks[0].id,
          stepNumber: '4',
          name: 'Done',
          description: 'Recruitment framework completed',
          movedBy: students[2].id
        }
      }),
    ])

    console.log('✅ Created', taskSteps.length, 'task step records')

    console.log('💬 Creating task comments...')
    // Task Comments for discussions
    const taskComments = await Promise.all([
      // Comments for Project 1 tasks
      prisma.taskComment.create({
        data: {
          taskId: project1Tasks[0].id,
          userId: students[0].id,
          content: 'Framework structure looks comprehensive. Should we include ESG criteria?'
        }
      }),
      prisma.taskComment.create({
        data: {
          taskId: project1Tasks[0].id,
          userId: students[5].id,
          content: 'Added ESG (Environmental, Social, Governance) section to the framework draft.'
        }
      }),
      prisma.taskComment.create({
        data: {
          taskId: project1Tasks[1].id,
          userId: students[9].id,
          content: 'Risk levels need to be more granular for better assessment.'
        }
      }),
      prisma.taskComment.create({
        data: {
          taskId: project1Tasks[1].id,
          userId: students[0].id,
          content: 'Agreed. Updated risk levels to include very low, low, medium, high, very high, and critical.'
        }
      }),
      // Comments for Project 2 tasks
      prisma.taskComment.create({
        data: {
          taskId: project2Tasks[0].id,
          userId: students[1].id,
          content: 'Need to verify latest customs updates before finalizing.'
        }
      }),
      prisma.taskComment.create({
        data: {
          taskId: project2Tasks[2].id,
          userId: students[6].id,
          content: 'Logistics partner contacts updated in the system.'
        }
      }),
      // Comments for Project 3 tasks
      prisma.taskComment.create({
        data: {
          taskId: project3Tasks[0].id,
          userId: students[2].id,
          content: 'Recruitment workflow needs approval from HR faculty.'
        }
      }),
      prisma.taskComment.create({
        data: {
          taskId: project3Tasks[1].id,
          userId: students[7].id,
          content: 'Candidate evaluation forms are ready for review.'
        }
      }),
    ])

    console.log('✅ Created', taskComments.length, 'task comments')

    console.log('💼 Creating vacancies for each project...')
    // Project 1 Vacancies
    const project1Vacancies = await Promise.all([
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Due Diligence Specialist',
          description: 'Responsible for conducting comprehensive due diligence investigations on suppliers including background checks, financial analysis, and operational assessments. Requires strong analytical skills, attention to detail, and experience in risk assessment.',
          type: 'FULL_TIME',
          skills: 'Due Diligence, Financial Analysis, Risk Assessment, Background Verification, Research Skills',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Risk Assessment Analyst',
          description: 'Analyze and evaluate supplier risks across financial, operational, and compliance dimensions. Develop risk scores and provide mitigation recommendations. Experience in risk modeling and regulatory compliance required.',
          type: 'FULL_TIME',
          skills: 'Risk Assessment, Financial Analysis, Compliance, Data Analysis, Reporting',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Compliance Verification Officer',
          description: 'Conduct compliance verification checks against industry standards and regulatory requirements. Maintain up-to-date knowledge of relevant regulations and prepare compliance reports. Strong attention to detail required.',
          type: 'FULL_TIME',
          skills: 'Compliance, Regulatory Knowledge, Audit Skills, Documentation, Quality Assurance',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Client Account Manager',
          description: 'Manage client relationships, coordinate verification projects, and ensure high client satisfaction. Act as primary point of contact for assigned clients. Strong communication and relationship management skills required.',
          type: 'FULL_TIME',
          skills: 'Client Relations, Account Management, Communication, Project Coordination, Problem Solving',
          slots: 2,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Research Associate',
          description: 'Conduct research on suppliers, industries, and regulatory requirements. Compile findings into comprehensive reports for due diligence and risk assessment teams. Research and analytical skills required.',
          type: 'PART_TIME',
          skills: 'Research, Data Collection, Analysis, Report Writing, Attention to Detail',
          slots: 3,
          filled: 0
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project1.id,
          title: 'Quality Assurance Specialist',
          description: 'Ensure quality of verification reports and risk assessments through review and audit processes. Develop and maintain quality standards for deliverables. Experience in QA and process improvement required.',
          type: 'FULL_TIME',
          skills: 'Quality Assurance, Process Improvement, Audit Skills, Attention to Detail, Documentation',
          slots: 1,
          filled: 0
        }
      })
    ])

    // Project 2 Vacancies
    const project2Vacancies = await Promise.all([
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Trade Documentation Specialist',
          description: 'Prepare and review trade documentation including commercial invoices, packing lists, certificates of origin, and customs declarations. Ensure compliance with all regulations and accuracy of documentation.',
          type: 'FULL_TIME',
          skills: 'Trade Documentation, Customs Regulations, Attention to Detail, International Trade, Documentation',
          slots: 4,
          filled: 3
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Logistics Coordinator',
          description: 'Coordinate with logistics providers to arrange international shipments, track shipments in transit, and ensure timely delivery. Manage relationships with carriers and resolve shipping issues.',
          type: 'FULL_TIME',
          skills: 'Logistics Coordination, International Shipping, Vendor Management, Problem Solving, Communication',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Customs Relations Officer',
          description: 'Manage relationships with customs authorities at major ports, facilitate clearance processes, and resolve customs-related issues. Maintain current knowledge of customs procedures and regulations.',
          type: 'FULL_TIME',
          skills: 'Customs Relations, Regulatory Compliance, Communication, Negotiation, Problem Resolution',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Tariff Classification Analyst',
          description: 'Classify goods according to Harmonized System codes, determine applicable duties and taxes, and provide duty optimization recommendations. Maintain knowledge of tariff schedules and trade agreements.',
          type: 'FULL_TIME',
          skills: 'Tariff Classification, HS Codes, Trade Agreements, Duty Calculation, Research',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Compliance Advisor',
          description: 'Provide advisory services on trade compliance, import/export regulations, and customs requirements. Keep clients informed of regulatory changes and ensure continued compliance.',
          type: 'FULL_TIME',
          skills: 'Trade Compliance, Regulatory Knowledge, Advisory, Communication, Client Service',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Shipment Tracking Specialist',
          description: 'Monitor shipments from origin to destination, provide status updates to clients, and proactively address delays or issues. Maintain tracking records and prepare shipment reports.',
          type: 'PART_TIME',
          skills: 'Shipment Tracking, Logistics, Customer Service, Attention to Detail, Communication',
          slots: 4,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project2.id,
          title: 'Trade Finance Coordinator',
          description: 'Coordinate trade finance activities including letters of credit, payment processing, and documentation for financial institutions. Ensure compliance with international payment standards.',
          type: 'FULL_TIME',
          skills: 'Trade Finance, International Payments, Documentation, Banking Knowledge, Compliance',
          slots: 1,
          filled: 0
        }
      })
    ])

    // Project 3 Vacancies
    const project3Vacancies = await Promise.all([
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Talent Sourcing Specialist',
          description: 'Source candidates through various channels including job boards, LinkedIn, and networking. Conduct initial screening and maintain candidate pipeline. Strong sourcing and networking skills required.',
          type: 'FULL_TIME',
          skills: 'Talent Sourcing, Recruitment, LinkedIn Sourcing, Candidate Screening, Networking',
          slots: 4,
          filled: 3
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Candidate Screening Specialist',
          description: 'Conduct detailed candidate screening including resume review, phone interviews, and skills assessment. Evaluate candidates against client requirements and prepare shortlists.',
          type: 'FULL_TIME',
          skills: 'Candidate Screening, Interviewing, Assessment, Resume Review, Evaluation',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Client Relations Manager',
          description: 'Manage relationships with hiring clients, understand their hiring needs, and ensure successful placements. Coordinate recruitment process from job brief to offer acceptance.',
          type: 'FULL_TIME',
          skills: 'Client Relations, Account Management, Communication, Recruitment Process, Sales',
          slots: 2,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Placement Coordinator',
          description: 'Coordinate candidate placement process including offer negotiation, reference checks, and onboarding support. Ensure smooth transition for both candidates and clients.',
          type: 'FULL_TIME',
          skills: 'Placement Coordination, Negotiation, Onboarding, Communication, Relationship Management',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Background Verification Specialist',
          description: 'Conduct background verification checks including employment history, education verification, and references. Prepare verification reports and ensure compliance with screening regulations.',
          type: 'PART_TIME',
          skills: 'Background Verification, Reference Checking, Compliance, Documentation, Research',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project3.id,
          title: 'Recruitment Marketing Associate',
          description: 'Develop and execute marketing campaigns to attract candidates and promote agency services. Manage social media presence and create content for recruitment branding.',
          type: 'FULL_TIME',
          skills: 'Marketing, Social Media, Content Creation, Recruitment, Branding',
          slots: 1,
          filled: 0
        }
      })
    ])

    // Project 4 Vacancies
    const project4Vacancies = await Promise.all([
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Virtual Administrative Assistant',
          description: 'Provide comprehensive administrative support to assigned clients including email management, scheduling, document preparation, and general office tasks. Strong organizational and communication skills required.',
          type: 'FULL_TIME',
          skills: 'Administration, Scheduling, Document Management, Communication, Organization',
          slots: 8,
          filled: 5
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Document Management Specialist',
          description: 'Manage document workflows, ensure proper filing and organization, maintain document templates, and implement document management systems. Attention to detail critical.',
          type: 'PART_TIME',
          skills: 'Document Management, Organization, Data Entry, Filing Systems, Quality Control',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Client Support Representative',
          description: 'Provide first-line support to clients, handle inquiries and requests, escalate issues as needed, and maintain high customer satisfaction. Strong customer service skills required.',
          type: 'FULL_TIME',
          skills: 'Customer Service, Communication, Problem Solving, Client Support, Professionalism',
          slots: 4,
          filled: 3
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Quality Control Coordinator',
          description: 'Monitor service quality, conduct client satisfaction surveys, review deliverables against standards, and coordinate quality improvement initiatives.',
          type: 'FULL_TIME',
          skills: 'Quality Control, Client Satisfaction, Analysis, Process Improvement, Communication',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Specialized Services Assistant',
          description: 'Provide specialized administrative services including bookkeeping support, social media management, or research based on client needs. Requires flexibility and multiple skill areas.',
          type: 'PART_TIME',
          skills: 'Bookkeeping, Social Media, Research, Administrative Support, Adaptability',
          slots: 4,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project4.id,
          title: 'Training and Development Coordinator',
          description: 'Design and deliver training programs for new virtual assistants, maintain training materials, and ensure consistent service standards across the team.',
          type: 'PART_TIME',
          skills: 'Training, Coordination, Communication, Documentation, Mentorship',
          slots: 1,
          filled: 0
        }
      })
    ])

    // Project 5 Vacancies
    const project5Vacancies = await Promise.all([
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'Education Counselor',
          description: 'Provide one-on-one counseling to students exploring international education options. Assess student goals, recommend suitable programs, and guide through application process. Strong interpersonal skills required.',
          type: 'FULL_TIME',
          skills: 'Counseling, Education, International Programs, Communication, Student Assessment',
          slots: 4,
          filled: 3
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'Application Support Specialist',
          description: 'Assist students with application preparation including essay review, resume editing, and application submission. Provide feedback on materials and ensure completeness.',
          type: 'FULL_TIME',
          skills: 'Application Support, Writing, Editing, Education, Attention to Detail',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'Visa Services Coordinator',
          description: 'Guide students through visa application processes, prepare visa documentation, and provide advice on visa requirements and interviews. Maintain knowledge of current visa regulations.',
          type: 'FULL_TIME',
          skills: 'Visa Services, Immigration Knowledge, Documentation, Coordination, Communication',
          slots: 3,
          filled: 2
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'Career Advisor',
          description: 'Provide career counseling and pathway planning to students considering international education for career advancement. Help align education choices with career goals.',
          type: 'PART_TIME',
          skills: 'Career Counseling, Career Planning, Education, Communication, Advising',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'University Relations Specialist',
          description: 'Maintain relationships with partner universities, coordinate application submissions, facilitate communication between students and universities, and stay informed about program changes.',
          type: 'FULL_TIME',
          skills: 'University Relations, Communication, Coordination, Relationship Management, Education',
          slots: 2,
          filled: 1
        }
      }),
      prisma.vacancy.create({
        data: {
          projectId: project5.id,
          title: 'Student Success Coordinator',
          description: 'Monitor enrolled students, provide ongoing support during studies, coordinate pre-departure activities, and collect feedback for continuous improvement.',
          type: 'FULL_TIME',
          skills: 'Student Support, Coordination, Communication, Problem Solving, Cultural Awareness',
          slots: 2,
          filled: 1
        }
      })
    ])

    const allVacancies = [
      ...project1Vacancies, ...project2Vacancies, ...project3Vacancies,
      ...project4Vacancies, ...project5Vacancies
    ]
    console.log('✅ Created', allVacancies.length, 'vacancies')

    console.log('📝 Creating leave requests...')
    const leaveRequests = await Promise.all([
      prisma.leaveRequest.create({
        data: {
          userId: students[0].id,
          projectId: project1.id,
          leaveType: 'PERSONAL_LEAVE',
          startDate: new Date('2024-12-20'),
          endDate: new Date('2024-12-27'),
          reason: 'Holiday break and family time',
          status: 'APPROVED',
          reviewedBy: employers[0].id,
          reviewedAt: new Date('2024-12-01'),
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[1].id,
          projectId: project1.id,
          leaveType: 'SICK_LEAVE',
          startDate: new Date('2024-11-15'),
          endDate: new Date('2024-11-16'),
          reason: 'Medical appointment and recovery',
          status: 'APPROVED',
          reviewedBy: employers[0].id,
          reviewedAt: new Date('2024-11-14'),
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[2].id,
          projectId: project2.id,
          leaveType: 'VACATION',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-01-22'),
          reason: 'Planned vacation',
          status: 'PENDING',
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[3].id,
          projectId: project2.id,
          leaveType: 'PERSONAL_LEAVE',
          startDate: new Date('2025-02-10'),
          endDate: new Date('2025-02-12'),
          reason: 'Personal matters',
          status: 'PENDING',
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[4].id,
          projectId: project3.id,
          leaveType: 'SICK_LEAVE',
          startDate: new Date('2024-10-08'),
          endDate: new Date('2024-10-09'),
          reason: 'Illness',
          status: 'APPROVED',
          reviewedBy: universityAdmins[0].id,
          reviewedAt: new Date('2024-10-07'),
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: students[5].id,
          projectId: project3.id,
          leaveType: 'VACATION',
          startDate: new Date('2025-03-20'),
          endDate: new Date('2025-03-27'),
          reason: 'Spring break trip',
          status: 'PENDING',
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null
        }
      }),
      prisma.leaveRequest.create({
        data: {
          userId: employers[0].id,
          projectId: project4.id,
          leaveType: 'PERSONAL_LEAVE',
          startDate: new Date('2024-12-24'),
          endDate: new Date('2025-01-02'),
          reason: 'Holiday period',
          status: 'APPROVED',
          reviewedBy: platformAdmin.id,
          reviewedAt: new Date('2024-12-10'),
          rejectionReason: null
        }
      })
    ])

    console.log('✅ Created', leaveRequests.length, 'leave requests')

    console.log('⏱️ Creating work sessions and time entries...')
    const workSessions = await Promise.all([
      prisma.workSession.create({
        data: {
          userId: students[0].id,
          startTime: new Date('2024-10-01T09:00:00Z'),
          endTime: new Date('2024-10-01T17:00:00Z'),
          duration: 28800
        }
      }),
      prisma.workSession.create({
        data: {
          userId: students[1].id,
          startTime: new Date('2024-10-02T09:00:00Z'),
          endTime: new Date('2024-10-02T17:30:00Z'),
          duration: 30600
        }
      }),
      prisma.workSession.create({
        data: {
          userId: students[2].id,
          startTime: new Date('2024-10-03T08:30:00Z'),
          endTime: new Date('2024-10-03T17:00:00Z'),
          duration: 30600
        }
      }),
      prisma.workSession.create({
        data: {
          userId: students[3].id,
          startTime: new Date('2024-10-04T09:00:00Z'),
          endTime: new Date('2024-10-04T16:00:00Z'),
          duration: 25200
        }
      })
    ])

    const timeEntries = await Promise.all([
      prisma.timeEntry.create({
        data: {
          taskId: project1Tasks[0].id,
          userId: students[5].id,
          date: new Date('2024-09-25'),
          hours: 6,
          description: 'Research and framework design',
          billable: true,
          hourlyRate: 75
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project1Tasks[0].id,
          userId: students[5].id,
          date: new Date('2024-09-26'),
          hours: 8,
          description: 'Develop evaluation criteria and checklists',
          billable: true,
          hourlyRate: 75
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project1Tasks[0].id,
          userId: students[5].id,
          date: new Date('2024-09-27'),
          hours: 7,
          description: 'Complete scoring system and final review',
          billable: true,
          hourlyRate: 75
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project2Tasks[0].id,
          userId: students[6].id,
          date: new Date('2024-09-20'),
          hours: 8,
          description: 'Research US customs regulations',
          billable: true,
          hourlyRate: 70
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project2Tasks[0].id,
          userId: students[6].id,
          date: new Date('2024-09-21'),
          hours: 7,
          description: 'Research international trade regulations',
          billable: true,
          hourlyRate: 70
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project3Tasks[0].id,
          userId: students[2].id,
          date: new Date('2024-09-28'),
          hours: 6,
          description: 'Define recruitment specializations',
          billable: true,
          hourlyRate: 65
        }
      }),
      prisma.timeEntry.create({
        data: {
          taskId: project3Tasks[0].id,
          userId: students[2].id,
          date: new Date('2024-09-29'),
          hours: 8,
          description: 'Finalize service focus areas and strategy',
          billable: true,
          hourlyRate: 65
        }
      })
    ])

    console.log('✅ Created', workSessions.length, 'work sessions')
    console.log('✅ Created', timeEntries.length, 'time entries')

    console.log('💰 Creating investments...')
    // Investment statuses: INTERESTED, PENDING, UNDER_REVIEW, AGREED, FUNDED
    const investments = await Promise.all([
      // FUNDED investment - completed deal
      prisma.investment.create({
        data: {
          userId: investors[0].id,
          projectId: project1.id,
          amount: 75000,
          type: 'EQUITY',
          equity: 8.5,
          status: 'FUNDED',
          investedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          fundedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          projectedReturn: 112500,
          terms: JSON.stringify({
            valuation: 882353,
            equityPercentage: 8.5,
            vestingPeriod: '4 years with 1 year cliff',
            boardSeat: false,
            votingRights: true,
            antiDilution: 'full ratchet'
          })
        }
      }),
      // AGREED investment - deal agreed, awaiting funding
      prisma.investment.create({
        data: {
          userId: investors[0].id,
          projectId: project2.id,
          amount: 100000,
          type: 'EQUITY',
          equity: 12,
          status: 'AGREED',
          investedAt: null,
          fundedAt: null,
          projectedReturn: 150000,
          terms: JSON.stringify({
            valuation: 833333,
            equityPercentage: 12,
            vestingPeriod: '4 years with 1 year cliff',
            boardSeat: true,
            votingRights: true,
            antiDilution: 'weighted average'
          })
        }
      }),
      // UNDER_REVIEW investment - proposal being reviewed
      prisma.investment.create({
        data: {
          userId: investors[1].id,
          projectId: project3.id,
          amount: 50000,
          type: 'EQUITY',
          equity: 5,
          status: 'UNDER_REVIEW',
          investedAt: null,
          fundedAt: null,
          projectedReturn: 75000,
          terms: JSON.stringify({
            valuation: 1000000,
            equityPercentage: 5,
            vestingPeriod: '3 years with 1 year cliff',
            boardSeat: false,
            votingRights: true
          })
        }
      }),
      // PENDING investment - new proposal
      prisma.investment.create({
        data: {
          userId: investors[1].id,
          projectId: project1.id,
          amount: 25000,
          type: 'EQUITY',
          equity: 3,
          status: 'PENDING',
          investedAt: null,
          fundedAt: null,
          projectedReturn: 37500,
          terms: JSON.stringify({
            valuation: 833333,
            equityPercentage: 3,
            vestingPeriod: '4 years with 1 year cliff'
          }),
          expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        }
      }),
      // INTERESTED investment - initial interest expressed
      prisma.investment.create({
        data: {
          userId: investors[0].id,
          projectId: project3.id,
          amount: 30000,
          type: 'EQUITY',
          equity: 3,
          status: 'INTERESTED',
          investedAt: null,
          fundedAt: null,
          projectedReturn: 45000,
          expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created', investments.length, 'investments')

    console.log('💬 Creating notifications...')
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: students[0].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Client Acquisition Outreach',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[5].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Design Due Diligence Framework',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[1].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Research Customs Regulations',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[2].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Define Recruitment Service Specializations',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[3].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Define Service Catalog',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[4].id,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: 'You have been assigned to task: Research Target Universities and Programs',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[0].id,
          type: 'PROJECT_UPDATE',
          title: 'Milestone Achieved',
          message: 'First Client Acquisition milestone has been completed for Global Supplier Verification Firm',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[1].id,
          type: 'PROJECT_UPDATE',
          title: 'Milestone Achieved',
          message: 'Customs Broker License Secured milestone has been completed',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: students[2].id,
          type: 'PROJECT_UPDATE',
          title: 'Milestone Achieved',
          message: 'First 10 Successful Placements milestone has been completed',
          priority: 'HIGH'
        }
      }),
      prisma.notification.create({
        data: {
          userId: investors[0].id,
          type: 'INVESTMENT',
          title: 'Investment Opportunity',
          message: 'Study-Abroad Counseling Agency is seeking seed funding. Review details in your dashboard.',
          priority: 'HIGH'
        }
      })
    ])

    console.log('✅ Created', notifications.length, 'notifications')

    console.log('📊 Creating ratings...')
    const ratings = await Promise.all([
      prisma.rating.create({
        data: {
          fromUserId: students[0].id,
          toUserId: students[5].id,
          type: 'COLLABORATION',
          score: 5,
          comment: 'Excellent collaboration on due diligence framework development. Great attention to detail and thorough analysis.',
          projectId: project1.id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[5].id,
          toUserId: students[0].id,
          type: 'EXECUTION',
          score: 5,
          comment: 'Outstanding leadership on client acquisition. Very strategic and results-oriented approach.',
          projectId: project1.id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[2].id,
          toUserId: employers[1].id,
          type: 'LEADERSHIP',
          score: 5,
          comment: 'Exceptional guidance on recruitment processes and client management.',
          projectId: project3.id
        }
      }),
      prisma.rating.create({
        data: {
          fromUserId: students[3].id,
          toUserId: students[7].id,
          type: 'COLLABORATION',
          score: 4,
          comment: 'Great collaboration on service catalog development. Strong communication skills.',
          projectId: project4.id
        }
      })
    ])

    console.log('✅ Created', ratings.length, 'ratings')

    console.log('📋 Creating audit logs...')
    const auditLogs = await Promise.all([
      prisma.auditLog.create({
        data: {
          userId: students[0].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: project1.id,
          details: 'Created project: Global Supplier Verification & Risk Assessment Firm'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[1].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: project2.id,
          details: 'Created project: Cross-Border Trade Facilitation Company'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[2].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: project3.id,
          details: 'Created project: Professional Recruitment Agency'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[3].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: project4.id,
          details: 'Created project: Virtual Administrative Support Company'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[4].id,
          action: 'CREATE',
          entity: 'Project',
          entityId: project5.id,
          details: 'Created project: International Study-Abroad Counseling Agency'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[5].id,
          action: 'CREATE',
          entity: 'Task',
          entityId: project1Tasks[0].id,
          details: 'Created task: Design Due Diligence Framework'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: investors[0].id,
          action: 'CREATE',
          entity: 'Investment',
          entityId: investments[0].id,
          details: 'Created investment of $75,000 in Global Supplier Verification Firm'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[0].id,
          action: 'UPDATE',
          entity: 'Milestone',
          entityId: project1Milestones[1].id,
          details: 'Updated milestone status to COMPLETED: First Client Acquisition'
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: students[2].id,
          action: 'LOGIN',
          entity: 'User',
          entityId: students[2].id,
          details: 'User logged in from IP: 192.168.1.105'
        }
      })
    ])

    console.log('✅ Created', auditLogs.length, 'audit logs')

    // ============================================
    // MISSING MODELS SEEDING
    // ============================================

    console.log('📄 Creating professional records...')
    const professionalRecords = await Promise.all([
      prisma.professionalRecord.create({
        data: {
          userId: students[0].id,
          recordType: 'CERTIFICATION',
          title: 'Risk Management Certification',
          description: 'Professional certification in risk management and assessment',
          startDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000),
          verified: true
        }
      }),
      prisma.professionalRecord.create({
        data: {
          userId: students[1].id,
          recordType: 'AWARD',
          title: 'Outstanding Student Award',
          description: 'Awarded for excellence in international business studies',
          startDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
          verified: true
        }
      }),
      prisma.professionalRecord.create({
        data: {
          userId: students[2].id,
          recordType: 'CERTIFICATION',
          title: 'HR Professional Certification',
          description: 'Certified Human Resources Professional',
          startDate: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000),
          verified: true
        }
      }),
      prisma.professionalRecord.create({
        data: {
          userId: employers[0].id,
          recordType: 'LICENSE',
          title: 'Business Consulting License',
          description: 'Licensed business consulting practitioner',
          startDate: new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000),
          verified: true
        }
      }),
      prisma.professionalRecord.create({
        data: {
          userId: students[3].id,
          recordType: 'CERTIFICATION',
          title: 'Administrative Management Certificate',
          description: 'Professional certificate in administrative management',
          startDate: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
          verified: false
        }
      })
    ])

    console.log('✅ Created', professionalRecords.length, 'professional records')

    console.log('🔍 Creating verification requests...')
    const verificationRequests = await Promise.all([
      prisma.verificationRequest.create({
        data: {
          userId: students[3].id,
          type: 'EDUCATION',
          status: 'PENDING',
          title: 'Verify Administrative Management Certificate',
          description: 'Request to verify professional certificate in administrative management',
          priority: 'MEDIUM',
          projectId: project4.id
        }
      }),
      prisma.verificationRequest.create({
        data: {
          userId: students[4].id,
          type: 'PROJECT',
          status: 'UNDER_REVIEW',
          title: 'Project Milestone Verification',
          description: 'Verify completion of Research Target Universities milestone',
          priority: 'HIGH',
          projectId: project5.id
        }
      }),
      prisma.verificationRequest.create({
        data: {
          userId: students[5].id,
          type: 'SKILL',
          status: 'VERIFIED',
          title: 'Verify Data Analysis Skills',
          description: 'Verification of advanced data analysis skills',
          priority: 'LOW',
          projectId: project1.id,
          reviewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.verificationRequest.create({
        data: {
          userId: students[6].id,
          type: 'EDUCATION',
          status: 'PENDING',
          title: 'Verify Degree Completion',
          description: 'Request to verify bachelor\'s degree completion',
          priority: 'HIGH',
          projectId: project2.id
        }
      }),
      prisma.verificationRequest.create({
        data: {
          userId: employers[1].id,
          type: 'BUSINESS',
          status: 'VERIFIED',
          title: 'Business Verification',
          description: 'Verification of TalentForce HR Solutions business entity',
          priority: 'HIGH',
          reviewedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created', verificationRequests.length, 'verification requests')

    console.log('📝 Creating agreements...')
    const agreements = await Promise.all([
      prisma.agreement.create({
        data: {
          userId: students[0].id,
          projectId: project1.id,
          title: 'Project Membership Agreement',
          content: 'This agreement outlines the terms and conditions for participation in the Global Supplier Verification project. Member agrees to contribute 20 hours per week and maintain confidentiality.',
          signed: true,
          signedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.agreement.create({
        data: {
          userId: students[1].id,
          projectId: project2.id,
          title: 'Cross-Border Trade Agreement',
          content: 'Agreement for participation in the Cross-Border Trade Facilitation project. Includes terms for intellectual property rights and confidentiality.',
          signed: true,
          signedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.agreement.create({
        data: {
          userId: students[2].id,
          projectId: project3.id,
          title: 'Recruitment Agency Agreement',
          content: 'Agreement for the Professional Recruitment Agency project. Outlines roles, responsibilities, and compensation structure.',
          signed: true,
          signedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.agreement.create({
        data: {
          userId: students[3].id,
          projectId: project4.id,
          title: 'Virtual Admin Services Agreement',
          content: 'Agreement for Virtual Administrative Support Company project. Defines service standards and deliverables.',
          signed: false
        }
      }),
      prisma.agreement.create({
        data: {
          userId: students[4].id,
          projectId: project5.id,
          title: 'Study-Abroad Counseling Agreement',
          content: 'Agreement for International Study-Abroad Counseling Agency project. Covers student data protection and service guidelines.',
          signed: true,
          signedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created', agreements.length, 'agreements')

    console.log('💼 Creating job postings...')
    const jobs = await Promise.all([
      // APPROVED jobs - visible on jobs page
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'Due Diligence Analyst',
          description: 'We are seeking a detail-oriented Due Diligence Analyst to join our team. The ideal candidate will have experience in supplier verification and risk assessment.',
          type: 'FULL_TIME',
          employmentType: 'FULL_TIME',
          location: 'Remote',
          salary: '$60,000 - $80,000',
          salaryMin: 60000,
          salaryMax: 80000,
          department: 'Due Diligence',
          status: 'ACTIVE',
          approvalStatus: 'APPROVED',
          views: 125,
          deadline: nextMonth,
          published: true,
          publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          metadata: JSON.stringify({
            companyName: 'Consulting Excellence LLC',
            category: 'BUSINESS',
            positions: '2',
            requirements: ['Bachelor degree in Business or related field', '2+ years experience in due diligence', 'Strong analytical skills', 'Attention to detail'],
            responsibilities: ['Conduct supplier verification', 'Assess risk factors', 'Prepare due diligence reports'],
            benefits: ['Remote work', 'Health insurance', 'Professional development']
          })
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[0].id,
          businessId: businesses[0].id,
          title: 'Risk Assessment Specialist',
          description: 'Looking for an experienced Risk Assessment Specialist to evaluate supplier risks and develop mitigation strategies.',
          type: 'FULL_TIME',
          employmentType: 'FULL_TIME',
          location: 'Hybrid',
          salary: '$70,000 - $90,000',
          salaryMin: 70000,
          salaryMax: 90000,
          department: 'Risk Assessment',
          status: 'ACTIVE',
          approvalStatus: 'APPROVED',
          views: 98,
          deadline: nextMonth,
          published: true,
          publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          metadata: JSON.stringify({
            companyName: 'Consulting Excellence LLC',
            category: 'BUSINESS',
            positions: '1',
            requirements: ['5+ years in risk assessment', 'Strong analytical background', 'Experience with supplier evaluation'],
            responsibilities: ['Evaluate supplier risks', 'Develop mitigation strategies', 'Report to management'],
            benefits: ['Competitive salary', 'Flexible hours', 'Career growth']
          })
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[1].id,
          businessId: businesses[1].id,
          title: 'Customs Compliance Officer',
          description: 'Seeking a Customs Compliance Officer to ensure adherence to international trade regulations and customs procedures.',
          type: 'FULL_TIME',
          employmentType: 'FULL_TIME',
          location: 'On-site - New York',
          salary: '$65,000 - $85,000',
          salaryMin: 65000,
          salaryMax: 85000,
          department: 'Compliance',
          status: 'ACTIVE',
          approvalStatus: 'APPROVED',
          views: 87,
          deadline: nextWeek,
          published: true,
          publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          metadata: JSON.stringify({
            companyName: 'TalentForce HR Solutions',
            category: 'BUSINESS',
            positions: '1',
            requirements: ['Knowledge of customs regulations', 'Experience in international trade', 'Strong communication skills'],
            responsibilities: ['Ensure customs compliance', 'Manage documentation', 'Coordinate with authorities'],
            benefits: ['Health benefits', '401k', 'Paid time off']
          })
        }
      }),
      // PENDING jobs - for admin approval testing
      prisma.job.create({
        data: {
          userId: employers[1].id,
          businessId: businesses[1].id,
          title: 'Logistics Coordinator',
          description: 'We need a Logistics Coordinator to manage cross-border shipping operations and coordinate with international carriers.',
          type: 'FULL_TIME',
          employmentType: 'FULL_TIME',
          location: 'Remote',
          salary: '$55,000 - $70,000',
          salaryMin: 55000,
          salaryMax: 70000,
          department: 'Logistics',
          status: 'ACTIVE',
          approvalStatus: 'PENDING',
          submissionDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          views: 76,
          deadline: nextMonth,
          published: false,
          metadata: JSON.stringify({
            companyName: 'TalentForce HR Solutions',
            category: 'BUSINESS',
            positions: '2',
            requirements: ['Experience in logistics', 'Knowledge of shipping software', 'Organizational skills'],
            responsibilities: ['Coordinate shipments', 'Track deliveries', 'Manage carriers'],
            benefits: ['Remote work', 'Insurance']
          })
        }
      }),
      prisma.job.create({
        data: {
          userId: employers[2].id,
          businessId: businesses[2].id,
          title: 'Technical Recruiter',
          description: 'Looking for a skilled Technical Recruiter to source and place IT professionals with our clients.',
          type: 'FULL_TIME',
          employmentType: 'FULL_TIME',
          location: 'Hybrid',
          salary: '$60,000 - $75,000',
          salaryMin: 60000,
          salaryMax: 75000,
          department: 'Sourcing',
          status: 'ACTIVE',
          approvalStatus: 'PENDING',
          submissionDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
          views: 134,
          deadline: nextWeek,
          published: false,
          metadata: JSON.stringify({
            companyName: 'OptiOps Management',
            category: 'BUSINESS',
            positions: '1',
            requirements: ['Recruiting experience', 'Technical knowledge', 'Communication skills'],
            responsibilities: ['Source candidates', 'Screen resumes', 'Coordinate interviews'],
            benefits: ['Competitive pay', 'Flexible schedule']
          })
        }
      }),
      prisma.job.create({
        data: {
          userId: investors[0].id,
          title: 'Investment Analyst Intern',
          description: 'Venture Fund Limited is offering an internship for Investment Analyst role. Great learning opportunity.',
          type: 'INTERNSHIP',
          employmentType: 'INTERNSHIP',
          location: 'Remote',
          salary: '$25/hour',
          salaryMin: 25,
          salaryMax: 25,
          department: 'Investment Analysis',
          status: 'ACTIVE',
          approvalStatus: 'PENDING',
          submissionDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
          views: 203,
          deadline: nextWeek,
          published: false,
          metadata: JSON.stringify({
            companyName: 'Venture Fund Limited',
            category: 'BUSINESS',
            positions: '1',
            requirements: ['Finance background', 'Analytical skills', 'Interest in investments'],
            responsibilities: ['Analyze investment opportunities', 'Prepare reports', 'Support senior analysts'],
            benefits: ['Learning opportunity', 'Networking', 'Potential full-time offer']
          })
        }
      })
    ])

    console.log('✅ Created', jobs.length, 'job postings')

    console.log('📋 Creating job applications...')
    const jobApplications = await Promise.all([
      prisma.jobApplication.create({
        data: {
          jobId: jobs[0].id,
          userId: students[0].id,
          status: 'UNDER_REVIEW'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[0].id,
          userId: students[5].id,
          status: 'PENDING'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[1].id,
          userId: students[6].id,
          status: 'INTERVIEW'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[2].id,
          userId: students[1].id,
          status: 'PENDING'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[3].id,
          userId: students[7].id,
          status: 'UNDER_REVIEW'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[4].id,
          userId: students[2].id,
          status: 'OFFER'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[5].id,
          userId: students[8].id,
          status: 'PENDING'
        }
      }),
      prisma.jobApplication.create({
        data: {
          jobId: jobs[5].id,
          userId: students[9].id,
          status: 'UNDER_REVIEW'
        }
      })
    ])

    console.log('✅ Created', jobApplications.length, 'job applications')

    console.log('💬 Creating messages...')
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          fromUserId: students[0].id,
          toUserId: students[1].id,
          content: 'Hi Emily! I saw your cross-border trade project. Would you be interested in collaborating on a joint venture?',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: students[1].id,
          toUserId: students[0].id,
          content: 'Hey Alex! That sounds great. Let\'s schedule a call to discuss details.',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: employers[0].id,
          toUserId: students[0].id,
          content: 'Alex, we reviewed your application for the Due Diligence Analyst position. We\'d like to schedule an interview.',
          read: false
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: students[2].id,
          toUserId: employers[2].id,
          content: 'Thank you for the job offer! I\'m excited to join the team.',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: investors[0].id,
          toUserId: students[4].id,
          content: 'James, I\'m interested in learning more about your study-abroad counseling project. Can you send me the pitch deck?',
          read: false
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: students[4].id,
          toUserId: investors[0].id,
          content: 'Hi Richard! Absolutely, I\'ll send it over today. Thanks for your interest!',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: platformAdmin.id,
          toUserId: students[3].id,
          content: 'Your verification request has been received and is currently under review. You will be notified once a decision is made.',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: students[5].id,
          toUserId: students[6].id,
          content: 'Hey David, how\'s the project going? Do you need any help with the risk assessment tasks?',
          read: false
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: students[6].id,
          toUserId: students[5].id,
          content: 'Thanks Rachel! Everything is on track. The customs regulations research is almost complete.',
          read: true
        }
      }),
      prisma.message.create({
        data: {
          fromUserId: employers[1].id,
          toUserId: employers[0].id,
          content: 'Hi John, we have some potential partnership opportunities. Would you be open to a discussion?',
          read: false
        }
      })
    ])

    console.log('✅ Created', messages.length, 'messages')

    console.log('🏆 Creating leaderboard entries...')
    const leaderboards = await Promise.all([
      prisma.leaderboard.create({
        data: {
          userId: students[0].id,
          category: 'PROJECT_COMPLETION',
          score: 95.5,
          rank: 1
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[1].id,
          category: 'PROJECT_COMPLETION',
          score: 92.3,
          rank: 2
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[2].id,
          category: 'PROJECT_COMPLETION',
          score: 89.7,
          rank: 3
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[5].id,
          category: 'TASK_EXECUTION',
          score: 88.2,
          rank: 1
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[6].id,
          category: 'TASK_EXECUTION',
          score: 85.6,
          rank: 2
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[0].id,
          category: 'COLLABORATION',
          score: 94.1,
          rank: 1
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[3].id,
          category: 'COLLABORATION',
          score: 91.8,
          rank: 2
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[2].id,
          category: 'LEADERSHIP',
          score: 93.4,
          rank: 1
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[0].id,
          category: 'LEADERSHIP',
          score: 90.2,
          rank: 2
        }
      }),
      prisma.leaderboard.create({
        data: {
          userId: students[7].id,
          category: 'SKILL_DEVELOPMENT',
          score: 87.9,
          rank: 1
        }
      })
    ])

    console.log('✅ Created', leaderboards.length, 'leaderboard entries')

    console.log('⭐ Creating point transactions...')
    const pointTransactions = await Promise.all([
      prisma.pointTransaction.create({
        data: {
          userId: students[0].id,
          points: 100,
          source: 'TASK_COMPLETION',
          description: 'Completed task: Client Acquisition Outreach',
          metadata: JSON.stringify({ taskId: allTasks[0]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[0].id,
          points: 150,
          source: 'MILESTONE_ACHIEVEMENT',
          description: 'Achieved milestone: First Client Acquisition',
          metadata: JSON.stringify({ projectId: project1.id, milestoneId: 'milestone-1' })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[1].id,
          points: 100,
          source: 'TASK_COMPLETION',
          description: 'Completed task: Research Customs Regulations',
          metadata: JSON.stringify({ taskId: allTasks[15]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[2].id,
          points: 120,
          source: 'TASK_COMPLETION',
          description: 'Completed task: Define Recruitment Service Specializations',
          metadata: JSON.stringify({ taskId: allTasks[30]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[5].id,
          points: 80,
          source: 'TASK_COMPLETION',
          description: 'Completed task: Design Due Diligence Framework',
          metadata: JSON.stringify({ taskId: allTasks[5]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[0].id,
          points: 50,
          source: 'COLLABORATION',
          description: 'Received positive rating for collaboration',
          metadata: JSON.stringify({ ratingId: ratings[0]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[5].id,
          points: 50,
          source: 'COLLABORATION',
          description: 'Received positive rating for collaboration',
          metadata: JSON.stringify({ ratingId: ratings[1]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[2].id,
          points: 75,
          source: 'LEADERSHIP',
          description: 'Received positive leadership rating',
          metadata: JSON.stringify({ ratingId: ratings[2]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[3].id,
          points: 40,
          source: 'COLLABORATION',
          description: 'Received rating for collaboration',
          metadata: JSON.stringify({ ratingId: ratings[3]?.id })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[1].id,
          points: 150,
          source: 'MILESTONE_ACHIEVEMENT',
          description: 'Achieved milestone: Customs Broker License Secured',
          metadata: JSON.stringify({ projectId: project2.id, milestoneId: 'milestone-2' })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[2].id,
          points: 150,
          source: 'MILESTONE_ACHIEVEMENT',
          description: 'Achieved milestone: First 10 Successful Placements',
          metadata: JSON.stringify({ projectId: project3.id, milestoneId: 'milestone-3' })
        }
      }),
      prisma.pointTransaction.create({
        data: {
          userId: students[3].id,
          points: 100,
          source: 'PROJECT_SUBMISSION',
          description: 'Submitted project for review: Virtual Administrative Support Company',
          metadata: JSON.stringify({ projectId: project4.id })
        }
      })
    ])

    console.log('✅ Created', pointTransactions.length, 'point transactions')

    console.log('🤝 Creating collaboration requests...')
    const collaborationRequests = await Promise.all([
      prisma.collaborationRequest.create({
        data: {
          fromId: students[0].id,
          toId: students[1].id,
          type: 'PROJECT',
          status: 'PENDING',
          message: 'I have an idea for a joint project combining supplier verification and cross-border trade expertise. Would you be interested?',
          projectId: project1.id
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: students[2].id,
          toId: students[3].id,
          type: 'PROJECT',
          status: 'ACCEPTED',
          message: 'Our projects complement each other well. Let\'s collaborate on sharing best practices between recruitment and administrative services.',
          projectId: project3.id
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: students[4].id,
          toId: students[0].id,
          type: 'MENTORSHIP',
          status: 'PENDING',
          message: 'I\'d love to learn from your experience in building and leading successful projects. Would you be willing to mentor me?',
          projectId: project5.id
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: students[5].id,
          toId: students[6].id,
          type: 'PARTNERSHIP',
          status: 'PENDING',
          message: 'Let\'s form a partnership to share resources and collaborate on our respective project tasks.',
          projectId: project1.id
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: employers[0].id,
          toId: employers[1].id,
          type: 'PARTNERSHIP',
          status: 'PENDING',
          message: 'Our companies have complementary services. Let\'s explore partnership opportunities.'
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: investors[0].id,
          toId: students[4].id,
          type: 'PROJECT',
          status: 'PENDING',
          message: 'I\'m interested in potentially investing in your study-abroad counseling project. Let\'s discuss terms.',
          projectId: project5.id
        }
      }),
      prisma.collaborationRequest.create({
        data: {
          fromId: students[1].id,
          toId: students[2].id,
          type: 'PROJECT',
          status: 'REJECTED',
          message: 'Unfortunately, I don\'t have capacity for additional collaborations at this time.',
          projectId: project2.id
        }
      })
    ])

    console.log('✅ Created', collaborationRequests.length, 'collaboration requests')

    console.log('✅ Creating project approvals...')
    const projectApprovals = await Promise.all([
      prisma.projectApproval.create({
        data: {
          projectId: project1.id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Project has been reviewed and meets all platform requirements. Excellent business case with clear milestones.',
          reviewedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.projectApproval.create({
        data: {
          projectId: project2.id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Project approved. Cross-border trade facilitation is a valuable service. Ensure compliance with all regulations.',
          reviewedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.projectApproval.create({
        data: {
          projectId: project3.id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Professional recruitment agency project approved. Good market potential and solid business model.',
          reviewedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.projectApproval.create({
        data: {
          projectId: project4.id,
          adminId: platformAdmin.id,
          status: 'UNDER_REVIEW',
          comments: 'Project is currently under review. We need more details about the service catalog and quality control processes.',
          reviewedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.projectApproval.create({
        data: {
          projectId: project5.id,
          adminId: platformAdmin.id,
          status: 'PENDING',
          comments: null,
          reviewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created', projectApprovals.length, 'project approvals')

    console.log('✅ Creating job approvals...')
    const jobApprovals = await Promise.all([
      prisma.jobApproval.create({
        data: {
          jobId: jobs[0].id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Job posting approved. Clear description and competitive salary range.',
          reviewedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.jobApproval.create({
        data: {
          jobId: jobs[1].id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Approved. Risk Assessment Specialist is a key role for the business.',
          reviewedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.jobApproval.create({
        data: {
          jobId: jobs[2].id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Job approved. Important compliance role with good detail in requirements.',
          reviewedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.jobApproval.create({
        data: {
          jobId: jobs[3].id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Approved. Logistics Coordinator position is well-defined.',
          reviewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.jobApproval.create({
        data: {
          jobId: jobs[4].id,
          adminId: platformAdmin.id,
          status: 'UNDER_REVIEW',
          comments: 'Currently reviewing. Need to verify the salary range matches market rates.',
          reviewedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.jobApproval.create({
        data: {
          jobId: jobs[5].id,
          adminId: platformAdmin.id,
          status: 'APPROVED',
          comments: 'Internship approved. Good opportunity for students to gain experience.',
          reviewedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created', jobApprovals.length, 'job approvals')

    console.log('✨ Business-focused database seeding completed successfully!')
    console.log('\n' + '='.repeat(50))
    console.log('📋 LOGIN CREDENTIALS:')
    console.log('='.repeat(50))
    console.log('')
    console.log('STUDENTS:')
    console.log('  Email: alex.stanford@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Alex Thompson')
    console.log('  Role: STUDENT')
    console.log('  University: Stanford University')
    console.log('  Major: Business Administration')
    console.log('')
    console.log('  Email: emily.mit@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Emily Chen')
    console.log('  Role: STUDENT')
    console.log('  University: MIT')
    console.log('  Major: International Business')
    console.log('')
    console.log('  Email: marcus.upenn@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Marcus Williams')
    console.log('  Role: STUDENT')
    console.log('  University: UPenn')
    console.log('  Major: Human Resources Management')
    console.log('')
    console.log('  Email: sophia.berkeley@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Sophia Martinez')
    console.log('  Role: STUDENT')
    console.log('  University: UC Berkeley')
    console.log('  Major: Administrative Management')
    console.log('')
    console.log('  Email: james.nyu@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: James Rodriguez')
    console.log('  Role: STUDENT')
    console.log('  University: NYU')
    console.log('  Major: Education & Career Counseling')
    console.log('')
    console.log('  Email: rachel.stanford@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Rachel Kim')
    console.log('  Role: STUDENT')
    console.log('  University: Stanford University')
    console.log('  Major: Finance & Risk Management')
    console.log('')
    console.log('  Email: david.mit@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: David Park')
    console.log('  Role: STUDENT')
    console.log('  University: MIT')
    console.log('  Major: Operations Management')
    console.log('')
    console.log('  Email: lisa.upenn@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Lisa Anderson')
    console.log('  Role: STUDENT')
    console.log('  University: UPenn')
    console.log('  Major: Marketing & Communications')
    console.log('')
    console.log('  Email: thomas.berkeley@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Thomas Brown')
    console.log('  Role: STUDENT')
    console.log('  University: UC Berkeley')
    console.log('  Major: Business Analytics')
    console.log('')
    console.log('  Email: natalie.nyu@edu.com')
    console.log('  Password: Password123!')
    console.log('  Name: Natalie Taylor')
    console.log('  Role: STUDENT')
    console.log('  University: NYU')
    console.log('  Major: Legal Studies')
    console.log('')
    console.log('EMPLOYERS:')
    console.log('  Email: john.adams@consulting.com')
    console.log('  Password: Password123!')
    console.log('  Name: John Adams')
    console.log('  Role: EMPLOYER')
    console.log('  Company: Consulting Excellence LLC')
    console.log('')
    console.log('  Email: sarah.mitchell@hrfirm.com')
    console.log('  Password: Password123!')
    console.log('  Name: Sarah Mitchell')
    console.log('  Role: EMPLOYER')
    console.log('  Company: TalentForce HR Solutions')
    console.log('')
    console.log('  Email: michael.roberts@operations.com')
    console.log('  Password: Password123!')
    console.log('  Name: Michael Roberts')
    console.log('  Role: EMPLOYER')
    console.log('  Company: OptiOps Management')
    console.log('')
    console.log('INVESTORS:')
    console.log('  Email: richard.anderson@venturefund.com')
    console.log('  Password: Password123!')
    console.log('  Name: Richard Anderson')
    console.log('  Role: INVESTOR')
    console.log('  Company: Venture Fund Limited')
    console.log('')
    console.log('  Email: jennifer.lee@seedfund.com')
    console.log('  Password: Password123!')
    console.log('  Name: Jennifer Lee')
    console.log('  Role: INVESTOR')
    console.log('  Company: Seed Fund')
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
    console.log('  Email: admin.upenn@upenn.edu')
    console.log('  Password: Password123!')
    console.log('  Name: Prof. James Wilson')
    console.log('  Role: UNIVERSITY_ADMIN')
    console.log('  University: UPenn')
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
    console.log('Project Members:', allProjectMembers.length)
    console.log('Departments:', allDepartments.length)
    console.log('Tasks:', allTasks.length)
    console.log('SubTasks:', subtasks.length)
    console.log('Task Dependencies:', taskDependencies.length)
    console.log('Milestones:', allMilestones.length)
    console.log('Vacancies:', allVacancies.length)
    console.log('Leave Requests:', leaveRequests.length)
    console.log('Work Sessions:', workSessions.length)
    console.log('Time Entries:', timeEntries.length)
    console.log('Investments:', investments.length)
    console.log('Notifications:', notifications.length)
    console.log('Ratings:', ratings.length)
    console.log('Audit Logs:', auditLogs.length)
    console.log('Professional Records:', professionalRecords.length)
    console.log('Verification Requests:', verificationRequests.length)
    console.log('Agreements:', agreements.length)
    console.log('Jobs:', jobs.length)
    console.log('Job Applications:', jobApplications.length)
    console.log('Messages:', messages.length)
    console.log('Leaderboards:', leaderboards.length)
    console.log('Point Transactions:', pointTransactions.length)
    console.log('Collaboration Requests:', collaborationRequests.length)
    console.log('Project Approvals:', projectApprovals.length)
    console.log('Job Approvals:', jobApprovals.length)
    console.log('')
    console.log('='.repeat(50))
    console.log('📋 BUSINESS PROJECTS OVERVIEW:')
    console.log('='.repeat(50))
    console.log('')
    console.log('1. Global Supplier Verification & Risk Assessment Firm')
    console.log('   Owner: Alex Thompson')
    console.log('   Team: 6 members')
    console.log('   Departments: 4 (Due Diligence, Risk Assessment, Compliance, Client Services)')
    console.log('   Milestones: 5')
    console.log('   Tasks: 15')
    console.log('   Vacancies: 6')
    console.log('')
    console.log('2. Cross-Border Trade Facilitation Company')
    console.log('   Owner: Emily Chen')
    console.log('   Team: 6 members')
    console.log('   Departments: 4 (Documentation, Logistics, Customs, Compliance)')
    console.log('   Milestones: 5')
    console.log('   Tasks: 15')
    console.log('   Vacancies: 7')
    console.log('')
    console.log('3. Professional Recruitment Agency')
    console.log('   Owner: Marcus Williams')
    console.log('   Team: 6 members')
    console.log('   Departments: 4 (Sourcing, Screening, Client Relations, Placement)')
    console.log('   Milestones: 5')
    console.log('   Tasks: 15')
    console.log('   Vacancies: 6')
    console.log('')
    console.log('4. Virtual Administrative Support Company')
    console.log('   Owner: Sophia Martinez')
    console.log('   Team: 6 members')
    console.log('   Departments: 4 (Document Management, Client Support, Quality Control, Specialized Services)')
    console.log('   Milestones: 5')
    console.log('   Tasks: 15')
    console.log('   Vacancies: 6')
    console.log('')
    console.log('5. International Study-Abroad Counseling Agency')
    console.log('   Owner: James Rodriguez')
    console.log('   Team: 6 members')
    console.log('   Departments: 4 (Admissions, Visa Services, Career Counseling, Partner Relations)')
    console.log('   Milestones: 5')
    console.log('   Tasks: 15')
    console.log('   Vacancies: 6')
    console.log('')
    console.log('✅ All business-focused data seeded successfully!')

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
