import prisma from '@/lib/db'
import { SECTION_COLORS } from '@/lib/constants/learning-paths'
import type {
  LearningPathProgressResponse,
  MilestoneCategory,
  MilestoneProgress,
  MilestoneStatus,
  SectionKey,
  SectionProgress,
} from '@/types/learning-path'

/**
 * Compute the user's progress through a learning path.
 * Reads milestones from DB, counts UserProgress records.
 */
export async function computeLearningPathProgress(
  userId: string,
  pathSlug = 'n5',
): Promise<LearningPathProgressResponse | null> {
  const path = await prisma.learningPath.findUnique({
    where: { slug: pathSlug },
    include: {
      milestones: { orderBy: { display_order: 'asc' } },
    },
  })

  if (!path) return null

  const enrollment = await prisma.userLearningPath.findUnique({
    where: { user_id_path_id: { user_id: userId, path_id: path.id } },
  })

  // Fetch all counts we need in parallel
  const [hiraganaCount, katakanaCount, n5VocabIds, n5GrammarIds, studyDays] = await Promise.all([
    prisma.userProgress.count({
      where: { user_id: userId, category: 'hiragana', status: { not: 'new' } },
    }),
    prisma.userProgress.count({
      where: { user_id: userId, category: 'katakana', status: { not: 'new' } },
    }),
    prisma.vocabulary.findMany({
      where: { jlpt_level: 'N5' },
      select: { id: true },
    }),
    prisma.grammarPattern.findMany({
      where: { jlpt_level: 'N5' },
      select: { id: true },
    }),
    prisma.studyDay.findMany({
      where: {
        user_id: userId,
        date: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
      select: { items_learned: true },
    }),
  ])

  const n5VocabIdSet = new Set(n5VocabIds.map((v) => v.id))
  const n5GrammarIdSet = new Set(n5GrammarIds.map((g) => g.id))

  const [vocabProgress, grammarProgress] = await Promise.all([
    prisma.userProgress.count({
      where: {
        user_id: userId,
        category: 'vocabulary',
        status: { not: 'new' },
        item_id: { in: [...n5VocabIdSet] },
      },
    }),
    prisma.userProgress.count({
      where: {
        user_id: userId,
        category: 'grammar',
        status: { not: 'new' },
        item_id: { in: [...n5GrammarIdSet] },
      },
    }),
  ])

  const categoryCounts: Record<string, number> = {
    hiragana: hiraganaCount,
    katakana: katakanaCount,
    vocabulary: vocabProgress,
    grammar: grammarProgress,
  }

  // Build milestone progress from DB milestones
  const milestones: MilestoneProgress[] = path.milestones.map((m) => {
    const targetCount = m.target_count
    const blocked = m.is_blocked

    const rawCount = categoryCounts[m.category] ?? 0
    const currentCount = Math.min(rawCount, targetCount)
    const percent = targetCount > 0 ? Math.round((currentCount / targetCount) * 100) : 0

    let status: MilestoneStatus = 'active'
    if (blocked) {
      status = 'locked'
    } else if (percent >= 100) {
      status = 'completed'
    }

    return {
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category as MilestoneCategory,
      status,
      currentCount,
      targetCount,
      percent: Math.min(percent, 100),
      linkHref: m.link_href,
    }
  })

  // Current milestone = first non-completed, non-locked
  const currentMilestone =
    milestones.find((m) => m.status === 'active' && m.percent < 100) ?? null
  const currentIdx = currentMilestone ? milestones.indexOf(currentMilestone) : -1
  const nextMilestone =
    currentIdx >= 0
      ? (milestones.slice(currentIdx + 1).find((m) => m.status !== 'locked') ?? null)
      : null

  // Build section progress
  const sectionMap = new Map<SectionKey, { current: number; target: number }>()

  for (const m of milestones) {
    if (m.status === 'locked') continue

    let key: SectionKey
    if (m.category === 'hiragana' || m.category === 'katakana') {
      key = 'kana'
    } else if (m.category === 'vocabulary') {
      key = 'vocabulary'
    } else if (m.category === 'grammar') {
      key = 'grammar'
    } else if (m.category === 'kanji') {
      key = 'kanji'
    } else {
      continue
    }

    const existing = sectionMap.get(key)
    if (!existing) {
      sectionMap.set(key, { current: m.currentCount, target: m.targetCount })
    } else {
      if (key === 'kana') {
        existing.current += m.currentCount
        existing.target += m.targetCount
      } else {
        if (m.targetCount > existing.target) {
          existing.current = m.currentCount
          existing.target = m.targetCount
        }
      }
    }
  }

  const sectionLabels: Record<SectionKey, string> = {
    kana: 'Kana',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    kanji: 'Kanji',
  }

  const sectionOrder: SectionKey[] = ['kana', 'vocabulary', 'grammar', 'kanji']
  const sections: SectionProgress[] = sectionOrder
    .filter((key) => sectionMap.has(key))
    .map((key) => {
      const s = sectionMap.get(key)!
      return {
        key,
        label: sectionLabels[key],
        currentCount: s.current,
        targetCount: s.target,
        percent: s.target > 0 ? Math.round((s.current / s.target) * 100) : 0,
        colorClass: SECTION_COLORS[key] ?? 'bg-gray-500',
      }
    })

  // Overall %
  const activeMilestones = milestones.filter((m) => m.status !== 'locked')
  const overallPercent =
    activeMilestones.length > 0
      ? Math.round(activeMilestones.reduce((sum, m) => sum + m.percent, 0) / activeMilestones.length)
      : 0

  // Estimate days remaining
  let estimatedDaysRemaining: number | null = null
  if (currentMilestone && studyDays.length > 0) {
    const totalLearned = studyDays.reduce((sum, d) => sum + d.items_learned, 0)
    const velocity = totalLearned / 14
    if (velocity > 0) {
      const remaining = currentMilestone.targetCount - currentMilestone.currentCount
      estimatedDaysRemaining = Math.ceil(remaining / velocity)
    }
  }

  return {
    pathId: path.id,
    pathSlug: path.slug,
    pathName: path.name,
    jlptLevel: path.jlpt_level,
    isEnrolled: enrollment !== null,
    overallPercent,
    milestones,
    sections,
    currentMilestone,
    nextMilestone,
    estimatedDaysRemaining,
  }
}
