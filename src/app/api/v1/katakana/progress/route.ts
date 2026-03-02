import { NextRequest } from 'next/server'
import { handleProgressGET, handleProgressPOST } from '@/lib/utils/kana-progress'

export async function GET() {
  return handleProgressGET('katakana')
}

export async function POST(request: NextRequest) {
  return handleProgressPOST(request, 'katakana')
}
