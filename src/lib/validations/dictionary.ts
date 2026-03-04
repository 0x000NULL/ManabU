import { z } from 'zod'

export const tokenizeSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text too long'),
})

export const dictionaryLookupSchema = z.object({
  word: z.string().min(1, 'Word is required').max(50, 'Word too long'),
  surface: z.string().max(50).optional(),
  reading: z.string().max(50).optional(),
  pos: z.string().max(50).optional(),
})

export type TokenizeInput = z.infer<typeof tokenizeSchema>
export type DictionaryLookupInput = z.infer<typeof dictionaryLookupSchema>
