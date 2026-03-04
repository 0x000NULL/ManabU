import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/utils/password'
import { changePasswordSchema } from '@/lib/validations/settings'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = changePasswordSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password_hash: true },
    })

    if (!dbUser) return unauthorizedError()

    const isValid = await verifyPassword(result.data.currentPassword, dbUser.password_hash)
    if (!isValid) {
      return validationError('Current password is incorrect', {
        currentPassword: ['Current password is incorrect'],
      })
    }

    const newHash = await hashPassword(result.data.newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    })

    return successResponse({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return serverError()
  }
}
