import { z } from 'zod'

export const enrollSchema = z.object({
  pathSlug: z.string().min(1).max(20),
})
