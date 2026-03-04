/**
 * Capture a screenshot from a video element.
 * Returns a JPEG data URL or null if capture fails (e.g., CORS restrictions).
 */
export function captureVideoScreenshot(
  video: HTMLVideoElement,
  quality = 0.8,
): string | null {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    // CORS or SecurityError — video from different origin
    return null
  }
}
