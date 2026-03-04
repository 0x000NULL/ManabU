import { z } from 'zod'

export const mineSentenceSchema = z.object({
  japanese: z.string().min(1, 'Japanese text is required').max(1000),
  english: z.string().max(1000).optional(),
  sourceMediaId: z.string().optional(),
  sourceEpisode: z.number().int().min(0).optional(),
  sourceTimestamp: z.number().int().min(0).optional(),
  screenshotDataUrl: z
    .string()
    .max(500_000, 'Screenshot too large (max 500KB)')
    .optional(),
  notes: z.string().max(1000).optional(),
})

export const updateMinedSentenceSchema = z.object({
  notes: z.string().max(1000).optional(),
  english: z.string().max(1000).optional(),
})

export const minedSentenceQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().max(200).optional(),
})

export type MineSentenceInput = z.infer<typeof mineSentenceSchema>
export type UpdateMinedSentenceInput = z.infer<typeof updateMinedSentenceSchema>
export type MinedSentenceQuery = z.infer<typeof minedSentenceQuerySchema>
