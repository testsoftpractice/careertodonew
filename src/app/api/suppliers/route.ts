import { NextRequest, NextResponse } from 'next/server'

// GET /api/suppliers - List suppliers
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Supplier model not found in database schema' },
    { status: 501 }
  )
}

// POST /api/suppliers - Create supplier profile
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Supplier model not found in database schema' },
    { status: 501 }
  )
}
