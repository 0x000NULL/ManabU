import { z } from 'zod'

export const updateSettingsSchema = z.object({
  dailyNewWordLimit: z.coerce.number().int().min(1).max(100).optional(),
  dailyNewGrammarLimit: z.coerce.number().int().min(1).max(50).optional(),
  reviewBatchSize: z.coerce.number().int().min(5).max(200).nullable().optional(),
  audioAutoplay: z.boolean().optional(),
  furiganaDisplay: z.enum(['always', 'hover', 'never']).optional(),
  theme: z.enum(['system', 'light', 'dark']).optional(),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be 50 characters or less')
    .trim(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
