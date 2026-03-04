export type MilestoneCategory = 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji' | 'reading'

export type MilestoneStatus = 'completed' | 'active' | 'locked'

export interface LearningPathMilestoneDefinition {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  targetCount: number | 'dynamic' // 'dynamic' = query DB for total
  jlptLevel?: string
  blocked?: boolean // true if content doesn't exist yet
  linkHref?: string // e.g. '/hiragana'
}

export interface LearningPathDefinition {
  id: string
  name: string
  slug: string
  jlptLevel: string
  description: string
  milestones: LearningPathMilestoneDefinition[]
}

export interface MilestoneProgress {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  status: MilestoneStatus
  currentCount: number
  targetCount: number
  percent: number
  linkHref: string | null
}

export type SectionKey = 'kana' | 'vocabulary' | 'grammar' | 'kanji'

export interface SectionProgress {
  key: SectionKey
  label: string
  currentCount: number
  targetCount: number
  percent: number
  colorClass: string
}

export interface LearningPathProgressResponse {
  pathId: string
  pathSlug: string
  pathName: string
  jlptLevel: string
  isEnrolled: boolean
  overallPercent: number
  milestones: MilestoneProgress[]
  sections: SectionProgress[]
  currentMilestone: MilestoneProgress | null
  nextMilestone: MilestoneProgress | null
  estimatedDaysRemaining: number | null
}

export interface LearningPathListItem {
  id: string
  name: string
  slug: string
  jlptLevel: string
  description: string
  milestoneCount: number
  isAvailable: boolean
  isEnrolled: boolean
}

export interface EnrollResponse {
  pathId: string
  startedAt: string
}
