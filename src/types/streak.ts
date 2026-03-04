export interface HeatmapDay {
  date: string // 'YYYY-MM-DD'
  minutesStudied: number
  itemsReviewed: number
  itemsLearned: number
}

export interface StreakResponse {
  currentStreak: number
  longestStreak: number
  todayActivity: {
    minutesStudied: number
    itemsReviewed: number
    itemsLearned: number
    hasActivity: boolean
  }
  totalStudyDays: number
  heatmap: HeatmapDay[]
}

export interface StudyDayRecord {
  date: Date
  minutesStudied: number
  itemsReviewed: number
  itemsLearned: number
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  todayActivity: {
    minutesStudied: number
    itemsReviewed: number
    itemsLearned: number
    hasActivity: boolean
  }
  totalStudyDays: number
  studyDays: HeatmapDay[]
}
