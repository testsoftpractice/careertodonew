import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

// DELETE /api/skills/[id] - Delete skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' })
    }

    const { id: skillId } = await params
    if (!skillId) {
      return NextResponse.json({
        success: false,
        error: 'Skill ID is required',
        message: 'Skill ID is required',
      })
    }

    // Check if user owns the skill
    const skill = await db.skill.findUnique({
      where: { id: skillId, userId: session.user.id },
    })

    if (!skill) {
      return NextResponse.json({
        success: false,
        error: 'Skill not found',
        message: 'Skill not found',
      })
    }

    await db.skill.delete({
      where: { id: skillId, userId: session.user.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully',
    })
  } catch (error) {
    console.error('DELETE skill error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete skill',
      message: 'Failed to delete skill',
    })
  }
}
