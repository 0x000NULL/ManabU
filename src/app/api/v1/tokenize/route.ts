import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { tokenize } from '@/lib/utils/tokenizer'
import { tokenizeSchema } from '@/lib/validations/dictionary'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = tokenizeSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const tokens = await tokenize(result.data.text)

    return successResponse({ text: result.data.text, tokens })
  } catch (error) {
    console.error('Tokenize POST error:', error)
    return serverError()
  }
}
