import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const user = await db.user.findUnique({
      where: { id },
      include: {
        university: true,
        projectsMembered: {
          include: {
            project: true,
          },
          orderBy: { joinedAt: 'desc' },
          take: 10,
        },
        professionalRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ratingsReceived: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate average ratings
    const ratings = user.ratingsReceived
    const avgExecution = ratings.filter(r => r.type === 'EXECUTION').reduce((acc, r) => acc + r.score, 0) / (ratings.filter(r => r.type === 'EXECUTION').length || 1)
    const avgCollaboration = ratings.filter(r => r.type === 'COLLABORATION').reduce((acc, r) => acc + r.score, 0) / (ratings.filter(r => r.type === 'COLLABORATION').length || 1)
    const avgLeadership = ratings.filter(r => r.type === 'LEADERSHIP').reduce((acc, r) => acc + r.score, 0) / (ratings.filter(r => r.type === 'LEADERSHIP').length || 1)
    const avgEthics = ratings.filter(r => r.type === 'ETHICS').reduce((acc, r) => acc + r.score, 0) / (ratings.filter(r => r.type === 'ETHICS').length || 1)
    const avgReliability = ratings.filter(r => r.type === 'RELIABILITY').reduce((acc, r) => acc + r.score, 0) / (ratings.filter(r => r.type === 'RELIABILITY').length || 1)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear,
        progressionLevel: user.progressionLevel,
        verificationStatus: user.verificationStatus,
        reputationScores: {
          execution: avgExecution || user.executionScore,
          collaboration: avgCollaboration || user.collaborationScore,
          leadership: avgLeadership || user.leadershipScore,
          ethics: avgEthics || user.ethicsScore,
          reliability: avgReliability || user.reliabilityScore,
        },
        projects: user.projectsMembered.map(pm => ({
          id: pm.project.id,
          name: pm.project.name,
          role: pm.role,
          status: pm.project.status,
          joinedAt: pm.joinedAt,
        })),
        records: user.professionalRecords,
        ratings: ratings.slice(0, 5),
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const body = await request.json()
    const {
      name,
      bio,
      avatar,
      location,
      linkedinUrl,
      portfolioUrl,
      major,
      graduationYear,
    } = body

    const user = await db.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(location !== undefined && { location }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(major !== undefined && { major }),
        ...(graduationYear !== undefined && { graduationYear: graduationYear ? parseInt(graduationYear) : null }),
      },
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location,
      },
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
