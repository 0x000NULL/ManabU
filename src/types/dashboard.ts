export interface WeeklyVelocityEntry {
  weekStart: string // 'YYYY-MM-DD' (Monday)
  itemsLearned: number
  itemsReviewed: number
}

export interface DashboardStatsResponse {
  kana: { hiraganaPercent: number; katakanaPercent: number }
  srs: { totalLearned: number; totalMastered: number; retentionRate: number }
  grammar: { patternsLearned: number; practiceAccuracy: number }
  studyTime: {
    thisWeekMinutes: number
    lastWeekMinutes: number
    thisMonthMinutes: number
    lastMonthMinutes: number
  }
  items: {
    learnedThisWeek: number
    learnedLastWeek: number
    reviewedThisWeek: number
    reviewedLastWeek: number
    learnedThisMonth: number
    learnedLastMonth: number
  }
  weeklyVelocity: WeeklyVelocityEntry[]
}
