import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api/auth-middleware'
import { isFeatureEnabled, GOVERNANCE_APPROVAL } from '@/lib/features/flags-v2'

// POST /api/governance/proposals - Create governance proposal
export async function POST(request: NextRequest) {
  if (!isFeatureEnabled(GOVERNANCE_APPROVAL)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = requireAuth(request)
  if ('status' in auth) return auth

  // Governance proposals feature not yet implemented
  return NextResponse.json({
    success: false,
    error: 'Governance proposals feature is not yet implemented'
  }, { status: 501 })
}

// GET /api/governance/proposals - Get all governance proposals
export async function GET(request: NextRequest) {
  if (!isFeatureEnabled(GOVERNANCE_APPROVAL)) {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 503 })
  }

  const auth = requireAuth(request)
  if ('status' in auth) return auth

  // Governance proposals feature not yet implemented
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Governance proposals feature is not yet implemented'
  })
}
