import { handleDueGET } from '@/lib/utils/kana-progress'

export async function GET() {
  return handleDueGET('katakana')
}
