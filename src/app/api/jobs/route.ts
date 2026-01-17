import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/jobs - List job postings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerId = searchParams.get('employerId')
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Mock job data (in production, fetch from database)
    let mockJobs = [
      {
        id: 'job-1',
        employerId: 'emp-1',
        title: 'Software Engineer Intern',
        companyName: 'Tech Corp',
        category: 'Technology',
        type: 'INTERNSHIP',
        description: 'Join our team to work on cutting-edge projects',
        location: 'Remote',
        salary: '$25/hour',
        requirements: ['React', 'TypeScript', 'Node.js'],
        skills: ['Problem Solving', 'Communication', 'Teamwork'],
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applications: 15,
        status: 'OPEN',
      },
      {
        id: 'job-2',
        employerId: 'emp-1',
        title: 'Product Manager - Entry Level',
        companyName: 'Tech Corp',
        category: 'Product',
        type: 'FULL_TIME',
        description: 'Help us build the next generation of products',
        location: 'San Francisco, CA',
        salary: '$80,000 - $100,000',
        requirements: ['Product Management', 'Agile', 'User Research'],
        skills: ['Strategic Thinking', 'Leadership', 'Data Analysis'],
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        applications: 32,
        status: 'OPEN',
      },
      {
        id: 'job-3',
        employerId: 'emp-2',
        title: 'Marketing Coordinator',
        companyName: 'Marketing Solutions Inc',
        category: 'Marketing',
        type: 'PART_TIME',
        description: 'Support our marketing team with campaigns and events',
        location: 'New York, NY',
        salary: '$40,000 - $50,000',
        requirements: ['Marketing', 'Social Media', 'Content Creation'],
        skills: ['Creativity', 'Organization', 'Communication'],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        applications: 28,
        status: 'OPEN',
      },
      {
        id: 'job-4',
        employerId: 'emp-2',
        title: 'Data Analyst Intern',
        companyName: 'Marketing Solutions Inc',
        category: 'Data & Analytics',
        type: 'INTERNSHIP',
        description: 'Analyze data to drive marketing decisions',
        location: 'Remote',
        salary: '$30/hour',
        requirements: ['SQL', 'Python', 'Excel'],
        skills: ['Data Visualization', 'Analysis', 'Attention to Detail'],
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applications: 20,
        status: 'OPEN',
      },
    ]

    // Filter jobs
    let filteredJobs = mockJobs

    if (employerId) {
      filteredJobs = filteredJobs.filter((j) => j.employerId === employerId)
    }

    if (search) {
      filteredJobs = filteredJobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase()) ||
        j.companyName.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category && category !== 'all') {
      filteredJobs = filteredJobs.filter((j) => j.category === category)
    }

    if (type && type !== 'all') {
      filteredJobs = filteredJobs.filter((j) => j.type === type)
    }

    // Sort by posting date (newest first)
    filteredJobs.sort((a, b) =>
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    )

    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        totalCount: filteredJobs.length,
        currentPage: page,
        totalPages: Math.ceil(filteredJobs.length / limit),
      },
    })
  } catch (error: any) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job posting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employerId,
      title,
      companyName,
      category,
      type,
      description,
      location,
      salary,
      requirements,
      skills,
      deadline,
    } = body

    // Validate input
    if (!employerId || !title || !category || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Employer ID, title, category, type, and description are required' },
        { status: 400 }
      )
    }

    // Create job (mock - in production, save to database)
    const job = {
      id: `job-${Date.now()}`,
      employerId,
      title,
      companyName: companyName || 'Company',
      category,
      type,
      description,
      location: location || 'Remote',
      salary,
      requirements: requirements || [],
      skills: skills || [],
      postedAt: new Date(),
      deadline: deadline ? new Date(deadline) : null,
      applications: 0,
      status: 'OPEN',
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Job posting created successfully',
        data: job,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
