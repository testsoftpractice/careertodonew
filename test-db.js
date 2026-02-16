const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const count = await prisma.university.count()
    console.log('University count:', count)
    
    const universities = await prisma.university.findMany({
      take: 3
    })
    console.log('Sample universities:', universities.map(u => ({ id: u.id, name: u.name, code: u.code })))
  } catch (error) {
    console.error('Database connection error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()