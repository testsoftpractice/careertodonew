import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

// DELETE /api/experiences/[id] - Delete experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: experienceId } = await params
    if (!experienceId) {
      return NextResponse.json({
        success: false,
        error: 'Experience ID is required',
        message: 'Experience ID is required',
      })
    }

    // Check if user owns the experience
    const experience = await db.experience.findUnique({
      where: { id: experienceId, userId: session.user.id },
    })
    if (!experience) {
      return NextResponse.json({
        success: false,
        error: 'Experience not found',
        message: 'Experience not found',
      })
    }

    await db.experience.delete({
      where: { id: experienceId, userId: session.user.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Experience deleted successfully',
    })
  } catch (error) {
    console.error('DELETE experience error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete experience',
      message: 'Failed to delete experience',
    })
  }
}
