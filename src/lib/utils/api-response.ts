import { NextResponse } from 'next/server'
import type { PaginationMeta } from '@/types/api'

export function successResponse<T>(data: T, meta?: PaginationMeta) {
  return NextResponse.json({ success: true, data, ...(meta && { meta }) })
}

export function createdResponse<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: Record<string, string[]>
) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details && { details }) } },
    { status }
  )
}

export function unauthorizedError(message = 'Unauthorized') {
  return errorResponse('UNAUTHORIZED', message, 401)
}

export function validationError(message: string, details?: Record<string, string[]>) {
  return errorResponse('VALIDATION_ERROR', message, 400, details)
}

export function notFoundError(message = 'Not found') {
  return errorResponse('NOT_FOUND', message, 404)
}

export function forbiddenError(message = 'Forbidden') {
  return errorResponse('FORBIDDEN', message, 403)
}

export function rateLimitError(message = 'Too many requests') {
  return errorResponse('RATE_LIMIT_EXCEEDED', message, 429)
}

export function serverError(message = 'Internal server error') {
  return errorResponse('INTERNAL_ERROR', message, 500)
}

export function cachedSuccessResponse<T>(data: T, maxAge: number, meta?: PaginationMeta) {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    {
      headers: {
        'Cache-Control': `private, max-age=${maxAge}, stale-while-revalidate=${Math.floor(maxAge / 5)}`,
      },
    },
  )
}
