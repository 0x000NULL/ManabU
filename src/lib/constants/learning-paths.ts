import type { LearningPathDefinition } from '@/types/learning-path'

export const N5_LEARNING_PATH: LearningPathDefinition = {
  id: 'n5',
  name: 'JLPT N5 Path',
  slug: 'n5',
  jlptLevel: 'N5',
  description: 'Master the fundamentals of Japanese — kana, core vocabulary, and basic grammar.',
  milestones: [
    {
      id: 'hiragana-foundation',
      title: 'Hiragana Foundation',
      description: 'Learn all 79 hiragana characters',
      category: 'hiragana',
      targetCount: 79,
      linkHref: '/hiragana',
    },
    {
      id: 'katakana-foundation',
      title: 'Katakana Foundation',
      description: 'Learn all 79 katakana characters',
      category: 'katakana',
      targetCount: 79,
      linkHref: '/katakana',
    },
    {
      id: 'first-100-words',
      title: 'First 100 Words',
      description: 'Learn 100 essential N5 vocabulary words',
      category: 'vocabulary',
      targetCount: 100,
      jlptLevel: 'N5',
      linkHref: '/vocabulary',
    },
    {
      id: 'basic-grammar',
      title: 'Basic Grammar',
      description: 'Learn 15 foundational N5 grammar patterns',
      category: 'grammar',
      targetCount: 15,
      jlptLevel: 'N5',
      linkHref: '/grammar',
    },
    {
      id: 'n5-vocabulary',
      title: 'N5 Vocabulary',
      description: 'Learn all 300 N5 vocabulary words',
      category: 'vocabulary',
      targetCount: 300,
      jlptLevel: 'N5',
      linkHref: '/vocabulary',
    },
    {
      id: 'n5-grammar-complete',
      title: 'N5 Grammar Complete',
      description: 'Master all N5 grammar patterns',
      category: 'grammar',
      targetCount: 'dynamic',
      jlptLevel: 'N5',
      linkHref: '/grammar',
    },
    {
      id: 'n5-kanji',
      title: 'N5 Kanji',
      description: 'Learn 100 essential N5 kanji characters',
      category: 'kanji',
      targetCount: 100,
      blocked: true,
    },
    {
      id: 'n5-reading',
      title: 'N5 Reading',
      description: 'Complete 5 beginner reading passages',
      category: 'reading',
      targetCount: 5,
      blocked: true,
    },
  ],
}

export const N4_LEARNING_PATH: LearningPathDefinition = {
  id: 'n4',
  name: 'JLPT N4 Path',
  slug: 'n4',
  jlptLevel: 'N4',
  description:
    'Build on your N5 foundation with intermediate vocabulary, grammar, and kanji.',
  milestones: [],
}

export const N3_LEARNING_PATH: LearningPathDefinition = {
  id: 'n3',
  name: 'JLPT N3 Path',
  slug: 'n3',
  jlptLevel: 'N3',
  description:
    'Reach conversational fluency with advanced grammar, expanded vocabulary, and reading comprehension.',
  milestones: [],
}

export const ALL_LEARNING_PATHS: LearningPathDefinition[] = [
  N5_LEARNING_PATH,
  N4_LEARNING_PATH,
  N3_LEARNING_PATH,
]

/** Section color classes for the progress bars */
export const SECTION_COLORS: Record<string, string> = {
  kana: 'bg-amber-500',
  vocabulary: 'bg-primary',
  grammar: 'bg-purple-500',
  kanji: 'bg-rose-500',
}
