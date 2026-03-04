import { getAuthUser } from '@/lib/auth'
import { computeLearningPathProgress } from '@/lib/utils/learning-path-progress'
import {
  successResponse,
  unauthorizedError,
  notFoundError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const { slug } = await params
    const data = await computeLearningPathProgress(user.id, slug)
    if (!data) return notFoundError('Learning path not found')

    return successResponse(data)
  } catch (error) {
    console.error('Learning path progress GET error:', error)
    return serverError()
  }
}
