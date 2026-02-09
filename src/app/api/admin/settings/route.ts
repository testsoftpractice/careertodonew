import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/jwt'

interface PlatformSettings {
  id: string
  maintenanceMode: boolean
  publicRegistration: boolean
  autoApproveProjects: boolean
  enableAnalytics: boolean
}

// GET /api/admin/settings - Get platform settings
export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Get settings from database (you can create a PlatformSettings table or use environment variables)
    // For now, return default settings
    const settings: PlatformSettings = {
      id: 'default',
      maintenanceMode: false,
      publicRegistration: true,
      autoApproveProjects: false,
      enableAnalytics: true,
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error: any) {
    console.error('Get admin settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('token')
    const token = tokenCookie?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(decodeURIComponent(token))

    if (!decoded || decoded.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      maintenanceMode,
      publicRegistration,
      autoApproveProjects,
      enableAnalytics
    } = body

    // Validate settings
    const updates: Partial<PlatformSettings> = {}
    
    if (typeof maintenanceMode === 'boolean') {
      updates.maintenanceMode = maintenanceMode
    }
    
    if (typeof publicRegistration === 'boolean') {
      updates.publicRegistration = publicRegistration
    }
    
    if (typeof autoApproveProjects === 'boolean') {
      updates.autoApproveProjects = autoApproveProjects
    }
    
    if (typeof enableAnalytics === 'boolean') {
      updates.enableAnalytics = enableAnalytics
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid settings provided' },
        { status: 400 }
      )
    }

    // In a real implementation, you would save these to the database
    // For now, just return success
    const settings: PlatformSettings = {
      id: 'default',
      maintenanceMode: maintenanceMode ?? false,
      publicRegistration: publicRegistration ?? true,
      autoApproveProjects: autoApproveProjects ?? false,
      enableAnalytics: enableAnalytics ?? true,
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    })
  } catch (error: any) {
    console.error('Update admin settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
