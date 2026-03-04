import type { FrequencyTier } from '@/types/vocabulary'

interface FrequencyRankRange {
  gte: number
  lte?: number
}

/**
 * Returns a Prisma-compatible frequency_rank range for a given tier.
 * Inverse of getFrequencyTier() in src/lib/utils/vocabulary.ts.
 *
 * | Tier          | Range      |
 * |---------------|------------|
 * | essential     | 1-500      |
 * | core          | 501-1500   |
 * | intermediate  | 1501-3500  |
 * | expanding     | 3501-6000  |
 * | advanced      | 6001+      |
 */
export function getFrequencyRankRange(tier: FrequencyTier): FrequencyRankRange {
  switch (tier) {
    case 'essential':
      return { gte: 1, lte: 500 }
    case 'core':
      return { gte: 501, lte: 1500 }
    case 'intermediate':
      return { gte: 1501, lte: 3500 }
    case 'expanding':
      return { gte: 3501, lte: 6000 }
    case 'advanced':
      return { gte: 6001 }
  }
}
