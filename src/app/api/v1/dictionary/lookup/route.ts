import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { dictionaryLookupSchema } from '@/lib/validations/dictionary'
import { katakanaToHiragana } from '@/lib/utils/kana-convert'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'
import type { DictionaryEntry } from '@/types/subtitle'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const params = Object.fromEntries(request.nextUrl.searchParams)
    const result = dictionaryLookupSchema.safeParse(params)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { word, surface, reading, pos } = result.data

    // Look up in Vocabulary table by base form
    const vocab = await prisma.vocabulary.findUnique({
      where: { word },
      select: {
        id: true,
        word: true,
        reading: true,
        meaning: true,
        part_of_speech: true,
        jlpt_level: true,
        frequency_rank: true,
        sentences: {
          take: 3,
          select: {
            sentence: {
              select: {
                id: true,
                japanese: true,
                english: true,
                furigana: true,
              },
            },
          },
        },
      },
    })

    // Check SRS status if vocab exists
    let srs: DictionaryEntry['srs'] = null
    if (vocab) {
      const progress = await prisma.userProgress.findUnique({
        where: {
          user_id_category_item_id: {
            user_id: user.id,
            category: 'vocabulary',
            item_id: vocab.id,
          },
        },
        select: {
          status: true,
          repetitions: true,
          next_review_at: true,
        },
      })
      if (progress) {
        srs = {
          status: progress.status,
          repetitions: progress.repetitions,
          nextReviewAt: progress.next_review_at?.toISOString() ?? null,
        }
      }
    }

    const entry: DictionaryEntry = {
      surface: surface ?? word,
      baseForm: word,
      reading: reading ? katakanaToHiragana(reading) : (vocab?.reading ?? ''),
      pos: pos ?? (vocab?.part_of_speech ?? ''),
      posDetail: '',
      vocabularyId: vocab?.id ?? null,
      meaning: vocab?.meaning ?? null,
      jlptLevel: vocab?.jlpt_level ?? null,
      frequencyRank: vocab?.frequency_rank ?? null,
      sentences: vocab?.sentences.map((vs) => vs.sentence) ?? [],
      srs,
    }

    return successResponse(entry)
  } catch (error) {
    console.error('Dictionary lookup GET error:', error)
    return serverError()
  }
}
