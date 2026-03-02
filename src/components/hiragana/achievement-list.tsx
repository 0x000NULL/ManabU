'use client'

import { cn } from '@/lib/utils/cn'
import { useProgressStore } from '@/store/progress-store'
import { computeAchievements } from '@/lib/constants/achievements'
import type { KanaType } from '@/types/kana'

interface AchievementListProps {
  kanaType?: KanaType
}

export function AchievementList({ kanaType = 'hiragana' }: AchievementListProps) {
  const progressData = useProgressStore((s) => s[kanaType])

  if (!progressData || progressData.learnedCount === 0) return null

  const achievements = computeAchievements(progressData, kanaType)
  const unlockedCount = achievements.filter((a) => a.achieved).length

  if (unlockedCount === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Achievements ({unlockedCount}/{achievements.length})
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              'rounded-lg border px-4 py-3 transition-colors',
              achievement.achieved
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-muted/30 opacity-50',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{achievement.achieved ? '\u2713' : '\u25CB'}</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  achievement.achieved ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {achievement.title}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
