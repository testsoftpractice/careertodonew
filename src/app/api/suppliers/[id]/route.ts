import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/suppliers/[id] - Get a specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        supplier: {
          id: supplier.id,
          name: supplier.name,
          description: supplier.description,
          category: supplier.category,
          contactEmail: supplier.contactEmail,
          contactPhone: supplier.contactPhone,
          location: supplier.location,
          website: supplier.website,
          hourlyRate: supplier.hourlyRate,
          rating: supplier.rating,
          projectsCompleted: supplier.projectsCompleted,
          verified: supplier.verified,
          skills: supplier.skills ? JSON.parse(supplier.skills) : [],
          services: supplier.services ? JSON.parse(supplier.services) : [],
          certifications: supplier.certifications ? JSON.parse(supplier.certifications) : [],
          portfolioLinks: supplier.portfolioLinks ? JSON.parse(supplier.portfolioLinks) : [],
          companySize: supplier.companySize,
          yearsInBusiness: supplier.yearsInBusiness,
          createdAt: supplier.createdAt.toISOString(),
          owner: supplier.owner,
        },
      },
    })
  } catch (error: any) {
    console.error('Get supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
