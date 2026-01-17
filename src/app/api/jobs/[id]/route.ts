import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Mock job data (in production, fetch from database)
    const mockJobs = [
      {
        id: 'job-1',
        employerId: 'emp-1',
        title: 'Software Engineer Intern',
        companyName: 'Tech Corp',
        category: 'Technology',
        type: 'INTERNSHIP',
        description: 'Join our team to work on cutting-edge projects. You will have the opportunity to collaborate with experienced engineers and contribute to real-world projects.',
        location: 'Remote',
        salary: '$25/hour',
        salaryRange: {
          min: 20,
          max: 30,
        },
        requirements: [
          'Currently pursuing a degree in Computer Science or related field',
          'Strong understanding of JavaScript and TypeScript',
          'Familiarity with React and Node.js',
          'Problem-solving skills and attention to detail',
          'Good communication skills',
        ],
        responsibilities: [
          'Assist in developing and maintaining web applications',
          'Collaborate with the team to design and implement new features',
          'Write clean, maintainable code',
          'Participate in code reviews and team meetings',
          'Debug and resolve technical issues',
        ],
        benefits: [
          'Flexible working hours',
          'Learning and development opportunities',
          'Mentorship from senior engineers',
          'Potential for full-time offer',
          'Work from anywhere',
        ],
        applicationUrl: null,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 3,
        applications: 15,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'emp-1',
          name: 'HR Department',
          email: 'hr@techcorp.com',
        },
      },
      {
        id: 'job-2',
        employerId: 'emp-1',
        title: 'Product Manager - Entry Level',
        companyName: 'Tech Corp',
        category: 'Product',
        type: 'FULL_TIME',
        description: 'Help us build the next generation of products. You will work closely with cross-functional teams to deliver products that solve real customer problems.',
        location: 'San Francisco, CA',
        salary: '$80,000 - $100,000',
        salaryRange: {
          min: 80000,
          max: 100000,
        },
        requirements: [
          'Bachelor\'s degree or equivalent experience',
          'Strong analytical and problem-solving skills',
          'Experience with agile methodologies',
          'Excellent communication and presentation skills',
          'Passion for technology and user experience',
        ],
        responsibilities: [
          'Gather and analyze user requirements',
          'Create product roadmaps and feature specifications',
          'Work with engineering teams to deliver products',
          'Conduct market research and competitive analysis',
          'Measure and analyze product performance',
        ],
        benefits: [
          'Competitive salary and equity package',
          'Health, dental, and vision insurance',
          'Professional development budget',
          'Flexible PTO policy',
          'Hybrid work model',
        ],
        applicationUrl: null,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 1,
        applications: 32,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'emp-1',
          name: 'HR Department',
          email: 'hr@techcorp.com',
        },
      },
      {
        id: 'job-3',
        employerId: 'emp-2',
        title: 'Marketing Coordinator',
        companyName: 'Marketing Solutions Inc',
        category: 'Marketing',
        type: 'PART_TIME',
        description: 'Support our marketing team with campaigns and events. Great opportunity to gain hands-on marketing experience.',
        location: 'New York, NY',
        salary: '$40,000 - $50,000',
        salaryRange: {
          min: 40000,
          max: 50000,
        },
        requirements: [
          'Currently pursuing or recently graduated with a marketing degree',
          'Strong written and verbal communication skills',
          'Experience with social media platforms',
          'Basic knowledge of digital marketing tools',
          'Creative mindset with attention to detail',
        ],
        responsibilities: [
          'Assist in planning and executing marketing campaigns',
          'Manage social media accounts and create content',
          'Coordinate marketing events and webinars',
          'Analyze campaign performance and prepare reports',
          'Support the marketing team with various administrative tasks',
        ],
        benefits: [
          'Flexible schedule',
          'Marketing tools and software access',
          'Mentorship from marketing professionals',
          'Networking opportunities',
          'Potential for growth within the company',
        ],
        applicationUrl: null,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 2,
        applications: 28,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'emp-2',
          name: 'Marketing Team',
          email: 'careers@marketinginc.com',
        },
      },
      {
        id: 'job-4',
        employerId: 'emp-2',
        title: 'Data Analyst Intern',
        companyName: 'Marketing Solutions Inc',
        category: 'Data & Analytics',
        type: 'INTERNSHIP',
        description: 'Analyze data to drive marketing decisions. You will work with large datasets and help identify trends and insights.',
        location: 'Remote',
        salary: '$30/hour',
        salaryRange: {
          min: 25,
          max: 35,
        },
        requirements: [
          'Strong analytical and problem-solving skills',
          'Experience with SQL and Python',
          'Knowledge of Excel and data visualization tools',
          'Currently pursuing a degree in Data Science, Statistics, or related field',
          'Attention to detail and accuracy',
        ],
        responsibilities: [
          'Collect and clean data from various sources',
          'Perform statistical analysis and identify patterns',
          'Create reports and dashboards to visualize data',
          'Work with marketing team to provide actionable insights',
          'Document findings and recommendations',
        ],
        benefits: [
          'Work on real business problems',
          'Learn advanced analytics techniques',
          'Flexible working hours',
          'Professional development opportunities',
          'Potential for full-time employment',
        ],
        applicationUrl: null,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        positions: 1,
        applications: 20,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        postedBy: {
          id: 'emp-2',
          name: 'Marketing Team',
          email: 'careers@marketinginc.com',
        },
      },
    ]

    const job = mockJobs.find((j) => j.id === id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { job },
    })
  } catch (error: any) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
