import type { Achievement, HiraganaProgressSummary } from '@/types/progress'
import type { KanaType } from '@/types/kana'

interface AchievementDefinition {
  id: string
  title: (kanaType: KanaType) => string
  description: (kanaType: KanaType) => string
  check: (progress: HiraganaProgressSummary, kanaType: KanaType) => boolean
}

const VOWEL_CHARACTERS: Record<KanaType, string[]> = {
  hiragana: ['あ', 'い', 'う', 'え', 'お'],
  katakana: ['ア', 'イ', 'ウ', 'エ', 'オ'],
}

const KANA_LABEL: Record<KanaType, string> = {
  hiragana: 'hiragana',
  katakana: 'katakana',
}

const MASTER_TITLE: Record<KanaType, string> = {
  hiragana: 'Hiragana Master',
  katakana: 'Katakana Master',
}

const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-step',
    title: () => 'First Step',
    description: (kt) => `Learn your first ${KANA_LABEL[kt]} character`,
    check: (p) => p.learnedCount >= 1,
  },
  {
    id: 'vowel-master',
    title: () => 'Vowel Master',
    description: () => 'Learn all 5 vowel characters',
    check: (p, kt) => {
      const learnedChars = new Set(
        p.characters.filter((c) => c.status !== 'new').map((c) => c.character),
      )
      return VOWEL_CHARACTERS[kt].every((v) => learnedChars.has(v))
    },
  },
  {
    id: 'basic-complete',
    title: () => 'Basic Complete',
    description: (kt) => `Learn all 46 basic ${KANA_LABEL[kt]} characters`,
    check: (p) => {
      const basicGroups = new Set([
        'vowel',
        'k-row',
        's-row',
        't-row',
        'n-row',
        'h-row',
        'm-row',
        'y-row',
        'r-row',
        'w-row',
      ])
      const basicLearned = p.characters.filter(
        (c) => basicGroups.has(c.group) && c.status !== 'new',
      )
      return basicLearned.length >= 46
    },
  },
  {
    id: 'halfway-there',
    title: () => 'Halfway There',
    description: (kt) => `Learn 50% of all ${KANA_LABEL[kt]} characters`,
    check: (p) => p.completionPercent >= 50,
  },
  {
    id: 'full-set',
    title: () => 'Full Set',
    description: (kt) => `Learn all 79 ${KANA_LABEL[kt]} characters`,
    check: (p) => p.learnedCount >= 79,
  },
  {
    id: 'sharp-eye',
    title: () => 'Sharp Eye',
    description: () => 'Achieve 90%+ accuracy with 10+ characters reviewed',
    check: (p) => {
      const reviewed = p.characters.filter((c) => c.totalReviews > 0)
      return reviewed.length >= 10 && p.overallAccuracy >= 90
    },
  },
  {
    id: 'kana-master',
    title: (kt) => MASTER_TITLE[kt],
    description: (kt) => `Master all 79 ${KANA_LABEL[kt]} characters`,
    check: (p) => p.masteredCount >= 79,
  },
]

export function computeAchievements(
  progress: HiraganaProgressSummary,
  kanaType: KanaType = 'hiragana',
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    id: def.id,
    title: def.title(kanaType),
    description: def.description(kanaType),
    achieved: def.check(progress, kanaType),
  }))
}
