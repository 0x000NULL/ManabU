import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { updateSettingsSchema } from '@/lib/validations/settings'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

import { DEFAULT_SETTINGS } from '@/types/settings'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { settings: true },
    })

    const settings = { ...DEFAULT_SETTINGS, ...((dbUser?.settings as Record<string, unknown>) ?? {}) }

    return successResponse(settings)
  } catch (error) {
    console.error('User settings GET error:', error)
    return serverError()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = updateSettingsSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid settings', details)
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { settings: true },
    })

    const existing = (dbUser?.settings as Record<string, unknown>) ?? {}
    const merged = { ...DEFAULT_SETTINGS, ...existing, ...result.data }

    await prisma.user.update({
      where: { id: user.id },
      data: { settings: merged },
    })

    return successResponse(merged)
  } catch (error) {
    console.error('User settings PATCH error:', error)
    return serverError()
  }
}
