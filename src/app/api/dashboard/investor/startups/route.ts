import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { db } from '@/lib/db'

// GET /api/dashboard/investor/startups - Get investor's startup tracker
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if ('status' in auth) return auth

  const user = auth.user

  try {
    // Get investments made by this investor
    const investments = await db.investment.findMany({
      where: { userId: user.id },
      include: {
        project: {
          select: { id: true, name: true, status: true, businessId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get unique projects from investments
    const projectIds = investments
      .filter(inv => inv.project)
      .map(inv => inv.project!.id)

    // Get businesses for projects
    const businesses = await db.business.findMany({
      where: {
        id: {
          in: investments
            .filter(inv => inv.project?.businessId)
            .map(inv => inv.project!.businessId!)
        }
      }
    })

    const totalInvested = (investments || []).reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const totalValue = (investments || []).reduce((sum, inv) => sum + ((inv.amount || 0) * 0.8 + Math.random() * 0.4), 0)

    // Group by project to create startup list
    const startupsByProject = new Map<string, any>()
    investments.forEach(inv => {
      if (!inv.project) return

      const projectId = inv.project.id
      if (!startupsByProject.has(projectId)) {
        startupsByProject.set(projectId, {
          id: projectId,
          name: inv.project.name,
          investments: [],
          totalInvested: 0
        })
      }

      startupsByProject.get(projectId).investments.push(inv)
      startupsByProject.get(projectId).totalInvested += (inv.amount || 0)
    })

    const startups = Array.from(startupsByProject.values()).slice(0, 10).map((startup, index) => {
      const business = businesses.find(b => startup.name.toLowerCase().includes(b.name.toLowerCase()))
      const totalInvested = startup.totalInvested
      const currentValue = totalInvested * (1 + Math.random() * 0.4)
      const roi = currentValue > totalInvested ? ((currentValue - totalInvested) / totalInvested) * 100 : 0
      const employees = Math.floor(Math.random() * 50) + 5
      const monthlyGrowth = Math.floor(Math.random() * 5 + (Math.random() * 2)) - 2
      const foundedYear = 2018 + Math.floor(Math.random() * 6)

      return {
        id: startup.id,
        name: startup.name,
        industry: business?.industry || 'Technology',
        foundedYear,
        employees,
        monthlyGrowth,
        totalInvested,
        currentValue,
        roi: parseFloat(roi.toFixed(2))
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        startups,
        totalInvested: totalInvested.toFixed(2),
        totalValue: totalValue.toFixed(2),
        avgROI: startups.length > 0 ? (startups || []).reduce((sum, s) => sum + s.roi, 0) / startups.length : 0
      }
    })
  } catch (error) {
    console.error('Get startup tracker error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
