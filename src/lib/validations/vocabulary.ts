import { z } from 'zod'

export const vocabularyQuerySchema = z.object({
  jlptLevel: z
    .enum(['N5', 'N4', 'N3', 'N2', 'N1'])
    .optional(),
  frequencyTier: z
    .enum(['essential', 'core', 'intermediate', 'expanding', 'advanced'])
    .optional(),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export type VocabularyQueryInput = z.infer<typeof vocabularyQuerySchema>
