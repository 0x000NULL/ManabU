import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { mediaQuerySchema } from '@/lib/validations/media'
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
    const result = mediaQuerySchema.safeParse(params)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid query parameters', details)
    }

    const { type, difficulty, search, limit, offset } = result.data

    const where: Prisma.MediaContentWhereInput = {}

    if (type) {
      where.type = type
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { title_english: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [total, items] = await Promise.all([
      prisma.mediaContent.count({ where }),
      prisma.mediaContent.findMany({
        where,
        orderBy: { created_at: 'asc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          title_english: true,
          type: true,
          difficulty: true,
          jlpt_level: true,
          description: true,
          cover_image_url: true,
          genres: true,
          _count: { select: { episodes: true } },
        },
      }),
    ])

    const data = items.map((item) => ({
      id: item.id,
      title: item.title,
      title_english: item.title_english,
      type: item.type,
      difficulty: item.difficulty,
      jlpt_level: item.jlpt_level,
      description: item.description,
      cover_image_url: item.cover_image_url,
      genres: item.genres as string[],
      episode_count: item._count.episodes,
    }))

    return successResponse(data, {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Media GET error:', error)
    return serverError()
  }
}
