import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { quizResultSchema } from '@/lib/validations/progress'
import { processReview } from '@/lib/utils/srs-lite'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'
import type { CharacterProgress, HiraganaProgressSummary } from '@/types/progress'
import type { KanaType } from '@/types/kana'

function buildSummary(
  allKana: { character: string; romaji: string; group: string }[],
  progressMap: Map<
    string,
    {
      repetitions: number
      total_reviews: number
      correct_reviews: number
      status: string
      last_reviewed_at: Date | null
      next_review_at: Date | null
    }
  >,
): HiraganaProgressSummary {
  const now = new Date()
  const characters: CharacterProgress[] = allKana.map((kana) => {
    const prog = progressMap.get(kana.character)
    if (!prog) {
      return {
        character: kana.character,
        romaji: kana.romaji,
        group: kana.group,
        status: 'new' as const,
        repetitions: 0,
        totalReviews: 0,
        correctReviews: 0,
        accuracy: 0,
        lastReviewedAt: null,
        nextReviewAt: null,
      }
    }
    return {
      character: kana.character,
      romaji: kana.romaji,
      group: kana.group,
      status: prog.status as CharacterProgress['status'],
      repetitions: prog.repetitions,
      totalReviews: prog.total_reviews,
      correctReviews: prog.correct_reviews,
      accuracy:
        prog.total_reviews > 0
          ? Math.round((prog.correct_reviews / prog.total_reviews) * 100)
          : 0,
      lastReviewedAt: prog.last_reviewed_at?.toISOString() ?? null,
      nextReviewAt: prog.next_review_at?.toISOString() ?? null,
    }
  })

  const learnedCount = characters.filter((c) => c.status !== 'new').length
  const masteredCount = characters.filter((c) => c.status === 'mastered').length
  const reviewingCount = characters.filter((c) => c.status === 'reviewing').length
  const learningCount = characters.filter((c) => c.status === 'learning').length
  const newCount = characters.filter((c) => c.status === 'new').length

  const totalReviews = characters.reduce((sum, c) => sum + c.totalReviews, 0)
  const totalCorrect = characters.reduce((sum, c) => sum + c.correctReviews, 0)
  const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

  const dueCount = characters.filter(
    (c) => c.nextReviewAt && new Date(c.nextReviewAt) <= now,
  ).length

  return {
    totalCharacters: characters.length,
    learnedCount,
    masteredCount,
    reviewingCount,
    learningCount,
    newCount,
    overallAccuracy,
    completionPercent: Math.round((learnedCount / characters.length) * 100),
    dueCount,
    characters,
  }
}

async function fetchKanaAndProgress(userId: string, kanaType: KanaType) {
  const [allKana, progressRecords] = await Promise.all([
    prisma.kana.findMany({
      where: { type: kanaType },
      select: { id: true, character: true, romaji: true, group: true },
      orderBy: { display_order: 'asc' },
    }),
    prisma.userProgress.findMany({
      where: { user_id: userId, category: kanaType },
      select: {
        item_id: true,
        repetitions: true,
        total_reviews: true,
        correct_reviews: true,
        status: true,
        last_reviewed_at: true,
        next_review_at: true,
      },
    }),
  ])

  const kanaIdToChar = new Map(allKana.map((k) => [k.id, k.character]))
  const progressMap = new Map(
    progressRecords
      .filter((p) => kanaIdToChar.has(p.item_id))
      .map((p) => [kanaIdToChar.get(p.item_id)!, p]),
  )

  return { allKana, progressMap }
}

export async function handleProgressGET(kanaType: KanaType) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const { allKana, progressMap } = await fetchKanaAndProgress(user.id, kanaType)
    const summary = buildSummary(allKana, progressMap)
    return successResponse(summary)
  } catch (error) {
    console.error(`${kanaType} progress GET error:`, error)
    return serverError()
  }
}

export async function handleProgressPOST(request: NextRequest, kanaType: KanaType) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = quizResultSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { answers } = result.data

    const uniqueCharacters = [...new Set(answers.map((a) => a.character))]
    const kanaRecords = await prisma.kana.findMany({
      where: { character: { in: uniqueCharacters }, type: kanaType },
      select: { id: true, character: true, romaji: true, group: true },
    })

    const charToKana = new Map(kanaRecords.map((k) => [k.character, k]))

    const aggregated = new Map<string, boolean>()
    const charCounts = new Map<string, { correct: number; total: number }>()

    for (const answer of answers) {
      const counts = charCounts.get(answer.character) ?? { correct: 0, total: 0 }
      counts.total++
      if (answer.isCorrect) counts.correct++
      charCounts.set(answer.character, counts)
    }

    for (const [char, counts] of charCounts) {
      aggregated.set(char, counts.correct / counts.total > 0.5)
    }

    await prisma.$transaction(async (tx) => {
      for (const [character, isCorrect] of aggregated) {
        const kana = charToKana.get(character)
        if (!kana) continue

        const existing = await tx.userProgress.findUnique({
          where: {
            user_id_category_item_id: {
              user_id: user.id,
              category: kanaType,
              item_id: kana.id,
            },
          },
          select: { repetitions: true, total_reviews: true, correct_reviews: true },
        })

        const currentReps = existing?.repetitions ?? 0
        const srsUpdate = processReview(currentReps, isCorrect)
        const counts = charCounts.get(character)!

        await tx.userProgress.upsert({
          where: {
            user_id_category_item_id: {
              user_id: user.id,
              category: kanaType,
              item_id: kana.id,
            },
          },
          create: {
            user_id: user.id,
            category: kanaType,
            item_id: kana.id,
            repetitions: srsUpdate.repetitions,
            interval: srsUpdate.interval,
            next_review_at: srsUpdate.nextReviewAt,
            last_reviewed_at: new Date(),
            status: srsUpdate.status,
            total_reviews: counts.total,
            correct_reviews: counts.correct,
          },
          update: {
            repetitions: srsUpdate.repetitions,
            interval: srsUpdate.interval,
            next_review_at: srsUpdate.nextReviewAt,
            last_reviewed_at: new Date(),
            status: srsUpdate.status,
            total_reviews: { increment: counts.total },
            correct_reviews: { increment: counts.correct },
          },
        })
      }
    })

    const { allKana, progressMap } = await fetchKanaAndProgress(user.id, kanaType)
    const summary = buildSummary(allKana, progressMap)
    return successResponse(summary)
  } catch (error) {
    console.error(`${kanaType} progress POST error:`, error)
    return serverError()
  }
}

export async function handleDueGET(kanaType: KanaType) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const dueRecords = await prisma.userProgress.findMany({
      where: {
        user_id: user.id,
        category: kanaType,
        next_review_at: { lte: new Date() },
      },
      select: { item_id: true },
    })

    if (dueRecords.length === 0) {
      return successResponse({ dueCount: 0, characters: [] })
    }

    const kanaIds = dueRecords.map((r) => r.item_id)
    const kanaRecords = await prisma.kana.findMany({
      where: { id: { in: kanaIds } },
      select: { character: true, romaji: true, group: true },
      orderBy: { display_order: 'asc' },
    })

    return successResponse({
      dueCount: kanaRecords.length,
      characters: kanaRecords,
    })
  } catch (error) {
    console.error(`${kanaType} due reviews GET error:`, error)
    return serverError()
  }
}
