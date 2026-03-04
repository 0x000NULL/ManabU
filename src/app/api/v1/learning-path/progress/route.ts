import { getAuthUser } from '@/lib/auth'
import { computeLearningPathProgress } from '@/lib/utils/learning-path-progress'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const data = await computeLearningPathProgress(user.id, 'n5')
    if (!data) return serverError()

    return successResponse(data)
  } catch (error) {
    console.error('Learning path progress GET error:', error)
    return serverError()
  }
}
