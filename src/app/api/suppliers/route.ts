import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/suppliers - List suppliers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [suppliers, totalCount] = await Promise.all([
      db.supplier.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.supplier.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        suppliers: suppliers.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          contactEmail: s.contactEmail,
          contactPhone: s.contactPhone,
          location: s.location,
          website: s.website,
          hourlyRate: s.hourlyRate,
          rating: s.rating,
          projectsCompleted: s.projectsCompleted,
          verified: s.verified,
          skills: s.skills ? JSON.parse(s.skills) : [],
          services: s.services ? JSON.parse(s.services) : [],
          certifications: s.certifications ? JSON.parse(s.certifications) : [],
          portfolioLinks: s.portfolioLinks ? JSON.parse(s.portfolioLinks) : [],
          companySize: s.companySize,
          yearsInBusiness: s.yearsInBusiness,
          createdAt: s.createdAt.toISOString(),
        })),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    console.error('Get suppliers error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/suppliers - Create supplier profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      businessName,
      description,
      category,
      subCategories,
      expertise,
      hourlyRate,
      location,
      website,
      contactEmail,
      contactPhone,
      companySize,
      yearsInBusiness,
      portfolioLinks,
      services,
      certifications,
      userId,
    } = body

    // Use businessName as name if provided, otherwise use name
    const supplierName = businessName || name

    // Validate input
    if (!supplierName || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and description are required' },
        { status: 400 }
      )
    }

    if (!contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Contact email is required' },
        { status: 400 }
      )
    }

    // Create supplier
    const supplier = await db.supplier.create({
      data: {
        name: supplierName,
        description,
        category,
        contactEmail,
        contactPhone: contactPhone || null,
        location: location || null,
        website: website || null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        skills: expertise && expertise.length > 0 ? JSON.stringify(expertise) : null,
        services: services && services.length > 0 ? JSON.stringify(services) : null,
        certifications: certifications && certifications.length > 0 ? JSON.stringify(certifications) : null,
        portfolioLinks: portfolioLinks && portfolioLinks.length > 0 ? JSON.stringify(portfolioLinks) : null,
        companySize: companySize || null,
        yearsInBusiness: yearsInBusiness || null,
        userId: userId || null,
        rating: 0,
        projectsCompleted: 0,
        verified: false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Supplier profile created successfully',
        data: {
          id: supplier.id,
          name: supplier.name,
          description: supplier.description,
          category: supplier.category,
          contactEmail: supplier.contactEmail,
          rating: supplier.rating,
          projectsCompleted: supplier.projectsCompleted,
          verified: supplier.verified,
          createdAt: supplier.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
