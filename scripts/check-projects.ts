import { db } from '@/lib/db'

async function checkProjects() {
  console.log('Checking projects in database...\n')

  const projects = await db.project.findMany({
    select: {
      id: true,
      title: true,
      seekingInvestment: true,
      investmentGoal: true,
      status: true,
    },
    take: 10,
  })

  console.log('Projects:')
  projects.forEach((p) => {
    console.log(`- ${p.title}`)
    console.log(`  ID: ${p.id}`)
    console.log(`  Seeking Investment: ${p.seekingInvestment}`)
    console.log(`  Investment Goal: ${p.investmentGoal}`)
    console.log(`  Status: ${p.status}`)
    console.log()
  })

  const seekingInvestment = projects.filter((p) => p.seekingInvestment === true)
  console.log(`\nSummary: ${seekingInvestment.length} out of ${projects.length} projects are seeking investment`)

  await db.$disconnect()
}

checkProjects().catch(console.error)
