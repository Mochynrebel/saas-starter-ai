import { NextResponse } from 'next/server'
import { getImageGenerationCreditCost } from '@/lib/ai-cost'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cost = getImageGenerationCreditCost({
    model: searchParams.get('model') ?? undefined,
    size: searchParams.get('size') ?? undefined,
    mode: (searchParams.get('mode') as 'text-to-image' | 'image-to-image' | null) ?? undefined,
  })

  return NextResponse.json({
    cost,
  })
}


