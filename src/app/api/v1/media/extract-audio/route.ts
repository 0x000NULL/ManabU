import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { extractAudio, cleanupOldClips, AudioExtractionError } from '@/lib/utils/audio-extraction';

// Directory for storing audio clips (relative to project root)
const AUDIO_CLIPS_DIR = join(process.cwd(), 'public', 'audio-clips');

/**
 * POST /api/v1/media/extract-audio
 * 
 * Extract audio segment from video file
 * 
 * Request body:
 * {
 *   videoUrl: string,      // URL to video file (must be HTTPS and from whitelisted domain)
 *   startTime: number,     // Start time in seconds (>= 0)
 *   duration: number       // Duration in seconds (1-10)
 * }
 * 
 * Response:
 * {
 *   audioUrl: string       // Public URL path to extracted audio clip
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { videoUrl, startTime, duration } = body;

    // Validate required fields
    if (!videoUrl || startTime === undefined || duration === undefined) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['videoUrl', 'startTime', 'duration']
        },
        { status: 400 }
      );
    }

    // Get user identifier for rate limiting (IP address)
    const userIdentifier = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Trigger cleanup of old clips (async, don't wait)
    // This runs on each request to avoid needing a separate cron job
    cleanupOldClips(AUDIO_CLIPS_DIR).catch(err => {
      console.error('Cleanup error:', err);
    });

    // Extract audio
    const result = await extractAudio(
      {
        videoUrl,
        startTime,
        duration,
        userIdentifier,
      },
      AUDIO_CLIPS_DIR
    );

    return NextResponse.json({
      audioUrl: result.audioUrl,
    });

  } catch (error) {
    console.error('Audio extraction error:', error);

    // Handle our custom errors
    if (error instanceof AudioExtractionError) {
      return NextResponse.json(
        { 
          error: error.message,
          details: error.details
        },
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
    description: 'Extract audio segment from video file for sentence mining',
    requestBody: {
      videoUrl: 'string (HTTPS URL from whitelisted domain)',
      startTime: 'number (seconds, >= 0)',
      duration: 'number (seconds, 1-10)',
    },
    response: {
      audioUrl: 'string (public URL path to audio clip)',
    },
    errors: {
      400: 'Invalid input (validation failed)',
      429: 'Rate limit exceeded (max 10 requests per minute)',
      500: 'Server error (ffmpeg failure, network error, etc.)',
    },
    whitelistedDomains: [
      'digitaloceanspaces.com',
      'localhost',
      '127.0.0.1',
    ],
    rateLimit: '10 requests per minute per IP',
    cleanup: 'Audio clips older than 7 days are automatically deleted',
  });
}
