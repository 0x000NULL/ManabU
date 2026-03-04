import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { enrollSchema } from '@/lib/validations/learning-path'
import {
  successResponse,
  unauthorizedError,
  validationError,
  notFoundError,
  serverError,
} from '@/lib/utils/api-response'
import type { EnrollResponse } from '@/types/learning-path'

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const parsed = enrollSchema.safeParse(body)
    if (!parsed.success) {
      return validationError('Invalid request', {
        pathSlug: parsed.error.issues.map((i) => i.message),
      })
    }

    const path = await prisma.learningPath.findUnique({
      where: { slug: parsed.data.pathSlug },
      select: { id: true, is_available: true },
    })

    if (!path) return notFoundError('Learning path not found')
    if (!path.is_available) return validationError('This learning path is not available yet')

    // Upsert: if already enrolled, return existing
    const enrollment = await prisma.userLearningPath.upsert({
      where: { user_id_path_id: { user_id: user.id, path_id: path.id } },
      update: {},
      create: {
        user_id: user.id,
        path_id: path.id,
      },
    })

    const data: EnrollResponse = {
      pathId: enrollment.path_id,
      startedAt: enrollment.started_at.toISOString(),
    }

    return successResponse(data)
  } catch (error) {
    console.error('Learning path enroll POST error:', error)
    return serverError()
  }
}
