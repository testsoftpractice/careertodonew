import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ==================== TIME SUMMARY API ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.userId as string | undefined

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get all time entries for the user
    const timeEntries = await db.timeEntry.findMany({
      where: { userId },
      include: {
        task: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              }
            }
          }
        }
      }
    })

    // Group time by project
    const projectTimeMap = new Map<string, {
      project: any
      totalHours: number
      totalEntries: number
      entries: any[]
    }>()

    timeEntries.forEach(entry => {
      // Safety check for missing task or project
      if (!entry.task || !entry.task.project) {
        return
      }

      const projectId = entry.task.project.id
      const projectName = entry.task.project.name

      if (!projectTimeMap.has(projectId)) {
        projectTimeMap.set(projectId, {
          project: entry.task.project,
          totalHours: 0,
          totalEntries: 0,
          entries: []
        })
      }

      const data = projectTimeMap.get(projectId)!
      data.totalHours += entry.hours || 0
      data.totalEntries += 1
      data.entries.push(entry)
    })

    // Convert map to array and sort by total hours
    const projectSummaries = Array.from(projectTimeMap.values()).sort(
      (a, b) => b.totalHours - a.totalHours
    )

    // Calculate totals
    const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)
    const totalEntries = timeEntries.length

    // Get weekly stats (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentEntries = timeEntries.filter(entry => new Date(entry.date) >= sevenDaysAgo)
    const weeklyHours = recentEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    // Get monthly stats (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const monthlyEntries = timeEntries.filter(entry => new Date(entry.date) >= thirtyDaysAgo)
    const monthlyHours = monthlyEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        projectSummaries,
        totalHours,
        totalEntries,
        weeklyHours,
        weeklyEntries: recentEntries.length,
        monthlyHours,
        monthlyEntries: monthlyEntries.length,
      }
    })
  } catch (error) {
    console.error('Time Summary API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch time summary'
    }, { status: 500 })
  }
}
