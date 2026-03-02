import Link from 'next/link'
import { KATAKANA_GROUPS } from '@/lib/constants/katakana-groups'
import { KATAKANA_CHARACTERS } from '@/lib/constants/katakana-data'
import { getCharactersByGroup } from '@/lib/utils/kana'
import { GroupCard } from '@/components/hiragana/group-card'
import { ProgressOverview, GroupProgressBadge } from '@/components/hiragana/progress-overview'
import { AchievementList } from '@/components/hiragana/achievement-list'

const sortedGroups = [...KATAKANA_GROUPS].sort((a, b) => a.display_order - b.display_order)

const basicGroups = sortedGroups.filter((g) => !g.is_dakuten && !g.is_combination)
const voicedGroups = sortedGroups.filter((g) => g.is_dakuten)
const combinationGroups = sortedGroups.filter((g) => g.is_combination)

export default function KatakanaOverviewPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Katakana</h1>
        <p className="mt-1 text-muted-foreground">
          Learn all 79 katakana characters group by group with stroke order animations, audio, and
          mnemonics.
        </p>
      </div>

      <ProgressOverview kanaType="katakana" practiceHref="/katakana/practice" />

      <Link href="/katakana/practice">
        <div className="rounded-lg border border-border bg-background p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Practice</h2>
              <p className="text-sm text-muted-foreground">
                Test your knowledge with recognition, listening, and character quizzes
              </p>
            </div>
            <svg
              className="ml-auto h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Basic Characters</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {basicGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              characters={getCharactersByGroup(KATAKANA_CHARACTERS, group.id)}
              routePrefix="/katakana"
              progressBadge={
                <GroupProgressBadge
                  groupId={group.id}
                  totalCharacters={group.character_count}
                  kanaType="katakana"
                />
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Voiced Characters</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Dakuten (゛) and handakuten (゜) modify base characters to create voiced sounds.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {voicedGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              characters={getCharactersByGroup(KATAKANA_CHARACTERS, group.id)}
              routePrefix="/katakana"
              progressBadge={
                <GroupProgressBadge
                  groupId={group.id}
                  totalCharacters={group.character_count}
                  kanaType="katakana"
                />
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Combinations</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Yoon characters combine a consonant with a small ヤ, ユ, or ヨ.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {combinationGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              characters={getCharactersByGroup(KATAKANA_CHARACTERS, group.id)}
              routePrefix="/katakana"
              progressBadge={
                <GroupProgressBadge
                  groupId={group.id}
                  totalCharacters={group.character_count}
                  kanaType="katakana"
                />
              }
            />
          ))}
        </div>
      </section>

      <AchievementList kanaType="katakana" />

      <div className="border-t border-border pt-6">
        <Link
          href="/katakana/rules"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Special Rules — Long vowel mark, foreign sounds, and commonly confused pairs
        </Link>
      </div>
    </div>
  )
}
