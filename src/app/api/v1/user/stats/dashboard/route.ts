import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { getStudyDate } from '@/lib/utils/study-day'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'
import type { DashboardStatsResponse, WeeklyVelocityEntry } from '@/types/dashboard'

function getMonday(d: Date): Date {
  const result = new Date(d)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const today = getStudyDate()

    // Date boundaries
    const thisWeekMonday = getMonday(today)
    const lastWeekMonday = new Date(thisWeekMonday)
    lastWeekMonday.setDate(lastWeekMonday.getDate() - 7)

    const thisMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(thisMonthFirst)
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1)

    const eightWeeksAgo = new Date(thisWeekMonday)
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 7 * 7) // 8 weeks total (this week + 7 prior)

    const [
      hiraganaLearned,
      katakanaLearned,
      vocabLearned,
      vocabMastered,
      vocabRetention,
      grammarLearned,
      grammarAccuracy,
      studyDays,
    ] = await Promise.all([
      // Hiragana learned (non-new status)
      prisma.userProgress.count({
        where: { user_id: user.id, category: 'hiragana', status: { not: 'new' } },
      }),
      // Katakana learned
      prisma.userProgress.count({
        where: { user_id: user.id, category: 'katakana', status: { not: 'new' } },
      }),
      // Vocabulary learned
      prisma.userProgress.count({
        where: { user_id: user.id, category: 'vocabulary', status: { not: 'new' } },
      }),
      // Vocabulary mastered (interval >= 30 days)
      prisma.userProgress.count({
        where: { user_id: user.id, category: 'vocabulary', interval: { gte: 30 } },
      }),
      // Vocabulary retention
      prisma.userProgress.aggregate({
        where: { user_id: user.id, category: 'vocabulary', total_reviews: { gt: 0 } },
        _sum: { total_reviews: true, correct_reviews: true },
      }),
      // Grammar learned
      prisma.userProgress.count({
        where: { user_id: user.id, category: 'grammar', status: { not: 'new' } },
      }),
      // Grammar accuracy
      prisma.userProgress.aggregate({
        where: { user_id: user.id, category: 'grammar', total_reviews: { gt: 0 } },
        _sum: { total_reviews: true, correct_reviews: true },
      }),
      // StudyDay records for last 8 weeks
      prisma.studyDay.findMany({
        where: { user_id: user.id, date: { gte: eightWeeksAgo } },
        orderBy: { date: 'asc' },
      }),
    ])

    // Compute kana percentages (79 characters each)
    const hiraganaPercent = Math.round((hiraganaLearned / 79) * 100)
    const katakanaPercent = Math.round((katakanaLearned / 79) * 100)

    // Compute retention rate
    const totalReviews = vocabRetention._sum.total_reviews ?? 0
    const correctReviews = vocabRetention._sum.correct_reviews ?? 0
    const retentionRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0

    // Compute grammar accuracy
    const grammarTotal = grammarAccuracy._sum.total_reviews ?? 0
    const grammarCorrect = grammarAccuracy._sum.correct_reviews ?? 0
    const practiceAccuracy =
      grammarTotal > 0 ? Math.round((grammarCorrect / grammarTotal) * 100) : 0

    // Process StudyDay records into time buckets
    let thisWeekMinutes = 0
    let lastWeekMinutes = 0
    let thisMonthMinutes = 0
    let lastMonthMinutes = 0
    let learnedThisWeek = 0
    let learnedLastWeek = 0
    let reviewedThisWeek = 0
    let reviewedLastWeek = 0
    let learnedThisMonth = 0
    let learnedLastMonth = 0

    // Weekly velocity buckets: map of Monday date string -> entry
    const velocityMap = new Map<string, WeeklyVelocityEntry>()

    // Pre-populate 8 weeks
    for (let i = 0; i < 8; i++) {
      const weekMonday = new Date(thisWeekMonday)
      weekMonday.setDate(weekMonday.getDate() - i * 7)
      const key = formatDate(weekMonday)
      velocityMap.set(key, { weekStart: key, itemsLearned: 0, itemsReviewed: 0 })
    }

    for (const day of studyDays) {
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)

      // This week
      if (dayDate >= thisWeekMonday) {
        thisWeekMinutes += day.minutes_studied
        learnedThisWeek += day.items_learned
        reviewedThisWeek += day.items_reviewed
      }
      // Last week
      else if (dayDate >= lastWeekMonday && dayDate < thisWeekMonday) {
        lastWeekMinutes += day.minutes_studied
        learnedLastWeek += day.items_learned
        reviewedLastWeek += day.items_reviewed
      }

      // This month
      if (dayDate >= thisMonthFirst) {
        thisMonthMinutes += day.minutes_studied
        learnedThisMonth += day.items_learned
      }
      // Last month
      else if (dayDate >= lastMonthFirst && dayDate <= lastMonthEnd) {
        lastMonthMinutes += day.minutes_studied
        learnedLastMonth += day.items_learned
      }

      // Weekly velocity
      const weekMonday = getMonday(dayDate)
      const key = formatDate(weekMonday)
      const entry = velocityMap.get(key)
      if (entry) {
        entry.itemsLearned += day.items_learned
        entry.itemsReviewed += day.items_reviewed
      }
    }

    // Sort velocity entries chronologically
    const weeklyVelocity = Array.from(velocityMap.values()).sort((a, b) =>
      a.weekStart.localeCompare(b.weekStart),
    )

    const result: DashboardStatsResponse = {
      kana: { hiraganaPercent, katakanaPercent },
      srs: { totalLearned: vocabLearned, totalMastered: vocabMastered, retentionRate },
      grammar: { patternsLearned: grammarLearned, practiceAccuracy },
      studyTime: { thisWeekMinutes, lastWeekMinutes, thisMonthMinutes, lastMonthMinutes },
      items: {
        learnedThisWeek,
        learnedLastWeek,
        reviewedThisWeek,
        reviewedLastWeek,
        learnedThisMonth,
        learnedLastMonth,
      },
      weeklyVelocity,
    }

    return successResponse(result)
  } catch (error) {
    console.error('Dashboard stats GET error:', error)
    return serverError()
  }
}
