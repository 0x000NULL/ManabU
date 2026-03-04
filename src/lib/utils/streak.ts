import type { StudyDayRecord, StreakData, HeatmapDay } from '@/types/streak'
import { getStudyDate } from '@/lib/utils/study-day'

/**
 * Formats a Date as 'YYYY-MM-DD'.
 */
export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Pure function — calculates streak data from an array of study day records.
 *
 * - Active day = itemsReviewed > 0 OR itemsLearned > 0
 * - Current streak: counts backwards from today. If today has no activity yet,
 *   starts counting from yesterday (grace period until the study-day boundary).
 * - Longest streak: walks through the 90-day window tracking max consecutive.
 */
export function calculateStreaks(records: StudyDayRecord[], now?: Date): StreakData {
  const today = getStudyDate(now)
  const todayKey = dateKey(today)

  // Build lookup maps
  const activityMap = new Map<string, StudyDayRecord>()
  const activeSet = new Set<string>()

  for (const record of records) {
    const key = dateKey(record.date)
    activityMap.set(key, record)
    if (record.itemsReviewed > 0 || record.itemsLearned > 0) {
      activeSet.add(key)
    }
  }

  // Today's activity
  const todayRecord = activityMap.get(todayKey)
  const todayActivity = {
    minutesStudied: todayRecord?.minutesStudied ?? 0,
    itemsReviewed: todayRecord?.itemsReviewed ?? 0,
    itemsLearned: todayRecord?.itemsLearned ?? 0,
    hasActivity: activeSet.has(todayKey),
  }

  // Current streak: count backwards from today (or yesterday if no activity today)
  let currentStreak = 0
  const startDate = new Date(today)
  if (!activeSet.has(todayKey)) {
    startDate.setDate(startDate.getDate() - 1)
  }

  const cursor = new Date(startDate)
  while (activeSet.has(dateKey(cursor))) {
    currentStreak++
    cursor.setDate(cursor.getDate() - 1)
  }

  // Longest streak: walk forward through all 90 days
  const windowStart = new Date(today)
  windowStart.setDate(windowStart.getDate() - 89)

  let longestStreak = 0
  let runLength = 0
  const walker = new Date(windowStart)
  for (let i = 0; i < 90; i++) {
    if (activeSet.has(dateKey(walker))) {
      runLength++
      if (runLength > longestStreak) longestStreak = runLength
    } else {
      runLength = 0
    }
    walker.setDate(walker.getDate() + 1)
  }

  // Build heatmap for 90 days
  const heatmap: HeatmapDay[] = []
  const heatmapCursor = new Date(windowStart)
  for (let i = 0; i < 90; i++) {
    const key = dateKey(heatmapCursor)
    const record = activityMap.get(key)
    heatmap.push({
      date: key,
      minutesStudied: record?.minutesStudied ?? 0,
      itemsReviewed: record?.itemsReviewed ?? 0,
      itemsLearned: record?.itemsLearned ?? 0,
    })
    heatmapCursor.setDate(heatmapCursor.getDate() + 1)
  }

  return {
    currentStreak,
    longestStreak,
    todayActivity,
    totalStudyDays: activeSet.size,
    studyDays: heatmap,
  }
}
