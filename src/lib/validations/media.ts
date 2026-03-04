import { z } from 'zod'

export const mediaQuerySchema = z.object({
  type: z.enum(['anime', 'drama', 'movie', 'youtube']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export type MediaQueryInput = z.infer<typeof mediaQuerySchema>

export const mediaProgressSchema = z.object({
  mediaId: z.string().min(1),
  episodeNumber: z.coerce.number().int().min(1),
  progressSeconds: z.coerce.number().int().min(0),
  completed: z.boolean().default(false),
})

export type MediaProgressInput = z.infer<typeof mediaProgressSchema>

export const mediaProgressQuerySchema = z.object({
  mediaId: z.string().min(1),
})

export type MediaProgressQueryInput = z.infer<typeof mediaProgressQuerySchema>
