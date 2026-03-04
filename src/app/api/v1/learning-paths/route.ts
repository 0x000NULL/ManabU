import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'
import type { LearningPathListItem } from '@/types/learning-path'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const paths = await prisma.learningPath.findMany({
      orderBy: { display_order: 'asc' },
      include: {
        _count: { select: { milestones: true } },
        enrollments: {
          where: { user_id: user.id },
          select: { id: true },
        },
      },
    })

    const data: LearningPathListItem[] = paths.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      jlptLevel: p.jlpt_level,
      description: p.description,
      milestoneCount: p._count.milestones,
      isAvailable: p.is_available,
      isEnrolled: p.enrollments.length > 0,
    }))

    return successResponse(data)
  } catch (error) {
    console.error('Learning paths list GET error:', error)
    return serverError()
  }
}
