import prisma from '@/lib/db'

const DAY_RESET_HOUR = 4

/**
 * Returns the "study day" Date. If before 4 AM, returns previous calendar day.
 * Zeroes out time so the result is suitable for the @db.Date column.
 */
export function getStudyDate(now?: Date): Date {
  const d = now ? new Date(now) : new Date()
  if (d.getHours() < DAY_RESET_HOUR) {
    d.setDate(d.getDate() - 1)
  }
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Records study activity for the current study day.
 * Uses upsert with increment for atomic, safe rapid calls.
 */
export async function recordStudyActivity(
  userId: string,
  activity: { itemsReviewed?: number; itemsLearned?: number; minutesStudied?: number },
): Promise<void> {
  const date = getStudyDate()

  await prisma.studyDay.upsert({
    where: { user_id_date: { user_id: userId, date } },
    create: {
      user_id: userId,
      date,
      items_reviewed: activity.itemsReviewed ?? 0,
      items_learned: activity.itemsLearned ?? 0,
      minutes_studied: activity.minutesStudied ?? 0,
    },
    update: {
      ...(activity.itemsReviewed && { items_reviewed: { increment: activity.itemsReviewed } }),
      ...(activity.itemsLearned && { items_learned: { increment: activity.itemsLearned } }),
      ...(activity.minutesStudied && {
        minutes_studied: { increment: activity.minutesStudied },
      }),
    },
  })
}
