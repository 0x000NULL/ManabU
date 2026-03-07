import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { successResponse, unauthorizedError, forbiddenError, serverError } from '@/lib/utils/api-response'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const eightWeeksAgo = new Date()
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

    const [progressRecords, sentencesMined, sentencesDueCount] = await Promise.all([
      prisma.userMediaProgress.findMany({
        where: { user_id: user.id },
        select: {
          progress_seconds: true,
          completed: true,
          watched_at: true,
        },
      }),
      prisma.minedSentence.count({
        where: { user_id: user.id },
      }),
      prisma.userProgress.count({
        where: {
          user_id: user.id,
          category: 'mined_sentence',
          next_review_at: { lte: new Date() },
        },
      }),
    ])

    const episodesWatched = progressRecords.length
    const episodesCompleted = progressRecords.filter((p) => p.completed).length
    const totalImmersionMinutes = Math.round(
      progressRecords.reduce((sum, p) => sum + p.progress_seconds, 0) / 60
    )

    // Group by week (Monday start) — same logic as SRS stats
    const weeklyMap = new Map<string, number>()
    for (const record of progressRecords) {
      const d = new Date(record.watched_at)
      if (d < eightWeeksAgo) continue
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(d)
      monday.setDate(diff)
      const key = monday.toISOString().slice(0, 10)
      weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + record.progress_seconds)
    }
    const weeklyImmersion = Array.from(weeklyMap.entries())
      .map(([weekStart, seconds]) => ({ weekStart, minutes: Math.round(seconds / 60) }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart))

    return successResponse({
      episodesWatched,
      episodesCompleted,
      totalImmersionMinutes,
      sentencesMined,
      sentencesDueCount,
      weeklyImmersion,
    })
  } catch (error) {
    console.error('Immersion stats GET error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}
