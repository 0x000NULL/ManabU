import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { calculateStreaks } from '@/lib/utils/streak'
import { getStudyDate } from '@/lib/utils/study-day'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'
import type { StudyDayRecord } from '@/types/streak'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const today = getStudyDate()
    const ninetyDaysAgo = new Date(today)
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89)

    const dbRecords = await prisma.studyDay.findMany({
      where: {
        user_id: user.id,
        date: { gte: ninetyDaysAgo },
      },
      orderBy: { date: 'asc' },
    })

    const records: StudyDayRecord[] = dbRecords.map((r) => ({
      date: r.date,
      minutesStudied: r.minutes_studied,
      itemsReviewed: r.items_reviewed,
      itemsLearned: r.items_learned,
    }))

    const streakData = calculateStreaks(records)

    return successResponse({
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      todayActivity: streakData.todayActivity,
      totalStudyDays: streakData.totalStudyDays,
      heatmap: streakData.studyDays,
    })
  } catch (error) {
    console.error('Streak GET error:', error)
    return serverError()
  }
}
