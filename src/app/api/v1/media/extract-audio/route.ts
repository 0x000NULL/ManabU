import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { extractAudio, cleanupOldClips, AudioExtractionError } from '@/lib/utils/audio-extraction'
import { getAuthUser } from '@/lib/auth'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'

// Directory for storing audio clips (relative to project root)
const AUDIO_CLIPS_DIR = join(process.cwd(), 'public', 'audio-clips')

/**
 * POST /api/v1/media/extract-audio
 *
 * Extract audio segment from video file (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication required
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!hasImmersionAccess(user.email)) {
      return NextResponse.json({ error: 'Immersion access restricted' }, { status: 403 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { videoUrl, startTime, duration } = body

    // Validate required fields
    if (!videoUrl || startTime === undefined || duration === undefined) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['videoUrl', 'startTime', 'duration'],
        },
        { status: 400 }
      )
    }

    // Trigger cleanup of old clips (async, don't wait)
    cleanupOldClips(AUDIO_CLIPS_DIR).catch((err) => {
      console.error(
        'Cleanup error:',
        err instanceof Error ? err.message : 'Unknown error'
      )
    })

    // Extract audio — use user ID as rate limit key instead of spoofable IP
    const result = await extractAudio(
      {
        videoUrl,
        startTime,
        duration,
        userIdentifier: user.id,
      },
      AUDIO_CLIPS_DIR
    )

    return NextResponse.json({
      audioUrl: result.audioUrl,
    })
  } catch (error) {
    console.error(
      'Audio extraction error:',
      error instanceof Error ? error.message : 'Unknown error'
    )

    // Handle our custom errors
    if (error instanceof AudioExtractionError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      )
    }

    // Handle unexpected errors
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/v1/media/extract-audio
 *
 * Returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/media/extract-audio',
    method: 'POST',
    description: 'Extract audio segment from video file for sentence mining (requires auth)',
    requestBody: {
      videoUrl: 'string (HTTPS URL from whitelisted domain)',
      startTime: 'number (seconds, >= 0)',
      duration: 'number (seconds, 1-10)',
    },
    response: {
      audioUrl: 'string (public URL path to audio clip)',
    },
    errors: {
      401: 'Authentication required',
      400: 'Invalid input (validation failed)',
      429: 'Rate limit exceeded (max 10 requests per minute)',
      500: 'Server error (ffmpeg failure, network error, etc.)',
    },
    whitelistedDomains: ['digitaloceanspaces.com'],
    rateLimit: '10 requests per minute per user',
    cleanup: 'Audio clips older than 7 days are automatically deleted',
  })
}
