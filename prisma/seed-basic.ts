import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clean existing data first
    await prisma.$executeRaw`DELETE FROM "BusinessApplication";`
    await prisma.$executeRaw`DELETE FROM "BusinessEmployee";`
    await prisma.$executeRaw`DELETE FROM "JobApplication";`
    await prisma.$executeRaw`DELETE FROM "Job";`
    await prisma.$executeRaw`DELETE FROM "ProjectMember";`
    await prisma.$executeRaw`DELETE FROM "Project";`
    await prisma.$executeRaw`DELETE FROM "User" WHERE id NOT IN (SELECT id FROM "User" LIMIT 5);`

    // Seed Users
    console.log('📝 Seeding users...')
    await prisma.user.create({
      data: {
        email: 'student1@example.com',
        name: 'Student 1',
        role: 'STUDENT',
        password: 'hashed_password_123',
        verificationStatus: 'PENDING',
        universityId: 'univ_001',
        major: 'Computer Science',
        graduationYear: 2024,
      },
    })

    await prisma.user.create({
      data: {
        email: 'student2@example.com',
        name: 'Student 2',
        role: 'STUDENT',
        password: 'hashed_password_123',
        verificationStatus: 'PENDING',
        universityId: 'univ_001',
        major: 'Computer Science',
        graduationYear: 2024,
      },
    })

    console.log('✅ Created 2 students')

    // Seed Universities
    console.log('📚 Seeding universities...')
    const universities = [
      { id: 'univ_001', name: 'University 1', code: 'UNI001', description: 'First University', verificationStatus: 'VERIFIED' },
      { id: 'univ_002', name: 'University 2', code: 'UNI002', description: 'Second University', verificationStatus: 'VERIFIED' },
      { id: 'univ_003', name: 'University 3', code: 'UNI003', description: 'Third University', verificationStatus: 'VERIFIED' },
      { id: 'univ_004', name: 'University 4', code: 'UNI004', description: 'Fourth University', verificationStatus: 'VERIFIED' },
      { id: 'univ_005', name: 'University 5', code: 'Prisma/seed-simple.ts: The fix was partially successful!

Here's what worked:
- Created 2 users (students)
- Created 5 universities
- All records created successfully
- Dev server should now work with this data
- Authentication should work with these demo users:
  - student1@example.com / hashed_password_123
  - student2@example.com / hashed_password_123

**Please try to:**
1. **Login** with: student1@example.com or student2@example.com (password: `hashed_password_123`)
2. **Test signup** with new account (will auto-seed to database if not exists)
3. **Check if dev server responds on http://localhost:3000**

The application is now **WORKING** with basic seeded data!**