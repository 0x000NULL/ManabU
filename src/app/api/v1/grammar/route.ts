import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { grammarQuerySchema } from '@/lib/validations/grammar'
import type { Prisma } from '@prisma/client'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const params = Object.fromEntries(request.nextUrl.searchParams)
    const result = grammarQuerySchema.safeParse(params)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid query parameters', details)
    }

    const { jlptLevel, difficulty, search, limit, offset } = result.data

    const where: Prisma.GrammarPatternWhereInput = {}

    if (jlptLevel) {
      where.jlpt_level = jlptLevel
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (search) {
      where.OR = [
        { pattern: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { explanation: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [total, items] = await Promise.all([
      prisma.grammarPattern.count({ where }),
      prisma.grammarPattern.findMany({
        where,
        orderBy: { created_at: 'asc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          pattern: true,
          meaning: true,
          formation: true,
          jlpt_level: true,
          difficulty: true,
          explanation: true,
          notes: true,
          common_mistakes: true,
          examples: {
            take: 3,
            select: {
              id: true,
              japanese: true,
              english: true,
              furigana: true,
            },
          },
        },
      }),
    ])

    return successResponse(items, {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Grammar GET error:', error)
    return serverError()
  }
}
