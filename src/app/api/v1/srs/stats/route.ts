import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'

const DAY_RESET_HOUR = 4
const DEFAULT_DAILY_LIMIT = 20

function getTodayBoundary(): Date {
  const now = new Date()
  const boundary = new Date(now)
  boundary.setHours(DAY_RESET_HOUR, 0, 0, 0)

  if (now < boundary) {
    boundary.setDate(boundary.getDate() - 1)
  }

  return boundary
}

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const todayBoundary = getTodayBoundary()

    const eightWeeksAgo = new Date()
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

    const [dueCount, learnedToday, totalLearned, dbUser, masteredCount, reviewedToday, retentionData, weeklyRecords] =
      await Promise.all([
        prisma.userProgress.count({
          where: {
            user_id: user.id,
            category: 'vocabulary',
            next_review_at: { lte: new Date() },
          },
        }),
        prisma.userProgress.count({
          where: {
            user_id: user.id,
            category: 'vocabulary',
            created_at: { gte: todayBoundary },
          },
        }),
        prisma.userProgress.count({
          where: {
            user_id: user.id,
            category: 'vocabulary',
          },
        }),
        prisma.user.findUnique({
          where: { id: user.id },
          select: { settings: true },
        }),
        prisma.userProgress.count({
          where: {
            user_id: user.id,
            category: 'vocabulary',
            interval: { gte: 30 },
          },
        }),
        prisma.userProgress.count({
          where: {
            user_id: user.id,
            category: 'vocabulary',
            last_reviewed_at: { gte: todayBoundary },
          },
        }),
        prisma.userProgress.aggregate({
          _sum: {
            total_reviews: true,
            correct_reviews: true,
          },
          where: {
            user_id: user.id,
            category: 'vocabulary',
            total_reviews: { gt: 0 },
          },
        }),
        prisma.userProgress.findMany({
          where: {
            user_id: user.id,
            category: 'vocabulary',
            created_at: { gte: eightWeeksAgo },
          },
          select: { created_at: true },
        }),
      ])

    const settings = (dbUser?.settings as Record<string, unknown>) ?? {}
    const dailyNewWordLimit =
      typeof settings.dailyNewWordLimit === 'number'
        ? settings.dailyNewWordLimit
        : DEFAULT_DAILY_LIMIT

    const totalReviews = retentionData._sum.total_reviews ?? 0
    const totalCorrectReviews = retentionData._sum.correct_reviews ?? 0
    const retentionRate = totalReviews > 0 ? Math.round((totalCorrectReviews / totalReviews) * 100) : 0

    // Group weekly records by week (Monday start)
    const weeklyMap = new Map<string, number>()
    for (const record of weeklyRecords) {
      const d = new Date(record.created_at)
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
      const monday = new Date(d)
      monday.setDate(diff)
      const key = monday.toISOString().slice(0, 10)
      weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + 1)
    }
    const weeklyLearning = Array.from(weeklyMap.entries())
      .map(([weekStart, count]) => ({ weekStart, count }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart))

    return successResponse({
      dueCount,
      learnedToday,
      totalLearned,
      dailyNewWordLimit,
      masteredCount,
      reviewedToday,
      retentionRate,
      totalReviews,
      totalCorrectReviews,
      weeklyLearning,
    })
  } catch (error) {
    console.error('SRS stats GET error:', error)
    return serverError()
  }
}
