import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { updateProfileSchema } from '@/lib/validations/settings'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return unauthorizedError()
    }

    return successResponse(user)
  } catch (error) {
    console.error('Profile error:', error)
    return serverError()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = updateProfileSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid profile data', details)
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { display_name: result.data.displayName },
      select: {
        id: true,
        email: true,
        display_name: true,
        created_at: true,
        last_login_at: true,
      },
    })

    return successResponse({
      id: updated.id,
      email: updated.email,
      displayName: updated.display_name,
      createdAt: updated.created_at.toISOString(),
      lastLoginAt: updated.last_login_at?.toISOString() ?? null,
    })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return serverError()
  }
}
