import { NextRequest, NextResponse } from 'next/server'
import { withTokenRefresh } from '@/lib/auth-server'
import { listUserGenerationHistory } from '@/lib/ai-generations'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      const limit = Math.min(
        Number.parseInt(request.nextUrl.searchParams.get('limit') || '20', 10) || 20,
        50
      )

      const generations = await listUserGenerationHistory(user.id, limit)

      return NextResponse.json({
        generations,
      })
    } catch (error) {
      console.error('[AI History] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch generation history' },
        { status: 500 }
      )
    }
  })
}
