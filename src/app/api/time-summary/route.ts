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

    // Get all work sessions for the user with work conditions
    const workSessions = await db.workSession.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
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

    // Group time by project from time entries
    const projectTimeMap = new Map<string, {
      project: any
      totalHours: number
      totalEntries: number
      entries: any[]
      workSessionsByType: Record<string, number>
    }>()

    // Process time entries
    timeEntries.forEach(entry => {
      // Safety check for missing task or project
      if (!entry.task || !entry.task.project) {
        return
      }

      const projectId = entry.task.project.id

      if (!projectTimeMap.has(projectId)) {
        projectTimeMap.set(projectId, {
          project: entry.task.project,
          totalHours: 0,
          totalEntries: 0,
          entries: [],
          workSessionsByType: {}
        })
      }

      const data = projectTimeMap.get(projectId)!
      data.totalHours += entry.hours || 0
      data.totalEntries += 1
      data.entries.push(entry)
    })

    // Process work sessions and add to project summaries
    workSessions.forEach(session => {
      // Get project ID from either direct project link or through task
      let projectId = session.projectId
      let project = session.project

      if (!projectId && session.task && session.task.project) {
        projectId = session.task.project.id
        project = session.task.project
      }

      // Skip if no project associated
      if (!projectId) {
        return
      }

      if (!projectTimeMap.has(projectId)) {
        projectTimeMap.set(projectId, {
          project,
          totalHours: 0,
          totalEntries: 0,
          entries: [],
          workSessionsByType: {}
        })
      }

      const data = projectTimeMap.get(projectId)!

      // Add work session duration (in seconds) converted to hours
      if (session.duration) {
        data.totalHours += session.duration / 3600
      }
      data.totalEntries += 1

      // Track sessions by work condition type
      const sessionType = session.type || 'UNSUPPORTED'
      if (!data.workSessionsByType[sessionType]) {
        data.workSessionsByType[sessionType] = 0
      }
      data.workSessionsByType[sessionType] += session.duration || 0
    })

    // Convert map to array and sort by total hours
    const projectSummaries = Array.from(projectTimeMap.values()).map(summary => ({
      ...summary,
      totalHours: Math.round(summary.totalHours * 100) / 100, // Round to 2 decimal places
      workSessionsByType: Object.fromEntries(
        Object.entries(summary.workSessionsByType).map(([type, seconds]) => [
          type,
          Math.round((seconds / 3600) * 100) / 100 // Convert seconds to hours and round
        ])
      )
    })).sort((a, b) => b.totalHours - a.totalHours)

    // Calculate totals
    const totalHoursFromEntries = timeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)
    const totalHoursFromSessions = workSessions.reduce((sum, session) => sum + ((session.duration || 0) / 3600), 0)
    const totalHours = totalHoursFromEntries + totalHoursFromSessions
    const totalEntries = timeEntries.length + workSessions.length

    // Get weekly stats (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentEntries = timeEntries.filter(entry => new Date(entry.date) >= sevenDaysAgo)
    const weeklyHoursFromEntries = recentEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    const recentSessions = workSessions.filter(session => new Date(session.startTime) >= sevenDaysAgo)
    const weeklyHoursFromSessions = recentSessions.reduce((sum, session) => sum + ((session.duration || 0) / 3600), 0)
    const weeklyHours = weeklyHoursFromEntries + weeklyHoursFromSessions

    // Get monthly stats (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const monthlyEntries = timeEntries.filter(entry => new Date(entry.date) >= thirtyDaysAgo)
    const monthlyHoursFromEntries = monthlyEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)

    const monthlySessions = workSessions.filter(session => new Date(session.startTime) >= thirtyDaysAgo)
    const monthlyHoursFromSessions = monthlySessions.reduce((sum, session) => sum + ((session.duration || 0) / 3600), 0)
    const monthlyHours = monthlyHoursFromEntries + monthlyHoursFromSessions

    // Summary by work session type across all sessions
    const workSessionTypeSummary: Record<string, number> = {}
    workSessions.forEach(session => {
      const type = session.type || 'UNSUPPORTED'
      if (!workSessionTypeSummary[type]) {
        workSessionTypeSummary[type] = 0
      }
      workSessionTypeSummary[type] += session.duration || 0
    })

    // Convert to hours
    Object.keys(workSessionTypeSummary).forEach(type => {
      workSessionTypeSummary[type] = Math.round((workSessionTypeSummary[type] / 3600) * 100) / 100
    })

    return NextResponse.json({
      success: true,
      data: {
        projectSummaries,
        totalHours: Math.round(totalHours * 100) / 100,
        totalEntries,
        weeklyHours: Math.round(weeklyHours * 100) / 100,
        weeklyEntries: recentEntries.length + recentSessions.length,
        monthlyHours: Math.round(monthlyHours * 100) / 100,
        monthlyEntries: monthlyEntries.length + monthlySessions.length,
        workSessionTypeSummary,
        totalWorkSessions: workSessions.length,
        activeWorkSessions: workSessions.filter(s => !s.endTime).length,
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
