import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/needs/[id] - Get a specific need
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Mock need data (in production, fetch from database)
    const mockNeeds = [
      {
        id: 'need-1',
        projectId: 'proj-1',
        title: 'Frontend Developer Needed',
        description: 'Looking for an experienced React developer for UI implementation. The ideal candidate should have strong TypeScript skills and experience with modern frontend frameworks.',
        category: 'Development',
        urgency: 'HIGH',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'API Integration'],
        budget: 5000,
        duration: '2-4 weeks',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      {
        id: 'need-2',
        projectId: 'proj-1',
        title: 'UI/UX Designer',
        description: 'Need design support for dashboard interfaces. Must have experience creating user-friendly interfaces and conducting user research.',
        category: 'Design',
        urgency: 'MEDIUM',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
        budget: 3000,
        duration: '1-2 weeks',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      },
      {
        id: 'need-3',
        projectId: 'proj-2',
        title: 'Marketing Strategist',
        description: 'Help create go-to-market strategy for product launch. Looking for someone with experience in digital marketing and growth hacking.',
        category: 'Marketing',
        urgency: 'LOW',
        skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO', 'Analytics'],
        budget: 4000,
        duration: '1-3 months',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      {
        id: 'need-4',
        projectId: 'proj-2',
        title: 'Backend Developer',
        description: 'Need API development and database optimization. Must be proficient in Node.js and PostgreSQL.',
        category: 'Development',
        urgency: 'HIGH',
        skills: ['Node.js', 'PostgreSQL', 'API Design', 'Database Optimization', 'REST APIs'],
        budget: 6000,
        duration: '3-6 months',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'user-3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
        },
      },
    ]

    const need = mockNeeds.find((n) => n.id === id)

    if (!need) {
      return NextResponse.json(
        { success: false, error: 'Need not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { need },
    })
  } catch (error: any) {
    console.error('Get need error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
