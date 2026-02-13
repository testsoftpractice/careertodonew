import { NextRequest, NextResponse } from 'next/server'

// GET /api/suppliers/[id] - Get a specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Supplier model doesn't exist in the schema
    return NextResponse.json(
      { success: false, error: 'Supplier model not found in database schema' },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Get supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
